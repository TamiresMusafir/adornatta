const crypto = require('node:crypto');
const { pool } = require('../database/connection');

const API_BASE_URL = 'https://api.mercadopago.com';

function criarErro(mensagem, statusCode = 400) {
    const erro = new Error(mensagem);
    erro.statusCode = statusCode;
    return erro;
}

function validarId(id, nome = 'Identificador') {
    if (
        !['number', 'string'].includes(typeof id) ||
        (typeof id === 'string' && !/^[0-9]+$/.test(id))
    ) {
        throw criarErro(`${nome} inválido.`);
    }

    const valor = Number(id);
    if (!Number.isSafeInteger(valor) || valor < 1) {
        throw criarErro(`${nome} inválido.`);
    }

    return valor;
}

function obterConfiguracao() {
    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
    const webhookSecret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;
    const webhookUrl = process.env.MERCADO_PAGO_WEBHOOK_URL;
    const frontendUrl = process.env.FRONTEND_URL;

    if (!accessToken || !webhookSecret || !webhookUrl || !frontendUrl) {
        throw criarErro(
            'A integração do Mercado Pago não está configurada por completo.',
            503
        );
    }

    let urlWebhook;
    let urlFrontend;
    try {
        urlWebhook = new URL(webhookUrl);
        urlFrontend = new URL(frontendUrl);
    } catch {
        throw criarErro('As URLs da integração de pagamento são inválidas.', 500);
    }

    if (urlWebhook.protocol !== 'https:') {
        throw criarErro(
            'A URL pública do webhook do Mercado Pago precisa usar HTTPS.',
            500
        );
    }
    if (!['http:', 'https:'].includes(urlFrontend.protocol)) {
        throw criarErro('A URL do frontend é inválida.', 500);
    }

    return {
        accessToken,
        webhookSecret,
        webhookUrl: urlWebhook.toString(),
        frontendUrl: urlFrontend,
        usarSandbox: process.env.MERCADO_PAGO_USE_SANDBOX === 'true',
    };
}

function validarConfiguracao() {
    obterConfiguracao();
}

function criarChaveIdempotencia(idpagamento) {
    const bytes = crypto
        .createHash('sha256')
        .update(`adornatta:mercado-pago:preference:${idpagamento}`)
        .digest();
    bytes[6] = (bytes[6] & 0x0f) | 0x50;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = bytes.subarray(0, 16).toString('hex');

    return [
        hex.slice(0, 8),
        hex.slice(8, 12),
        hex.slice(12, 16),
        hex.slice(16, 20),
        hex.slice(20, 32),
    ].join('-');
}

function criarUrlRetorno(frontendUrl, pedidoId, resultado) {
    const url = new URL('/pagamento/retorno', frontendUrl);
    url.searchParams.set('pedidoId', String(pedidoId));
    url.searchParams.set('resultado', resultado);
    return url.toString();
}

async function criarCheckout(pedidoIdInformado, usuarioAutenticado) {
    const pedidoId = validarId(pedidoIdInformado, 'Pedido');
    const configuracao = obterConfiguracao();
    const client = await pool.connect();
    let pedido;
    let itens;

    try {
        await client.query('BEGIN');
        const resultadoPedido = await client.query(
            `SELECT p.idpedido, p.idusuario, p.valor_total,
                    p.status AS status_pedido, pg.idpagamento,
                    pg.valor AS valor_pagamento, pg.status AS status_pagamento,
                    pg.idpreferencia, pg.url_checkout,
                    u.nome, u.email
             FROM pedido p
             JOIN pagamento pg ON pg.idpedido = p.idpedido
             JOIN usuario u ON u.idusuario = p.idusuario
             WHERE p.idpedido = $1
               AND pg.provedor = 'mercado_pago'
               AND pg.idpagamento = (
                   SELECT MAX(idpagamento)
                   FROM pagamento
                   WHERE idpedido = p.idpedido
               )
             FOR UPDATE OF p, pg`,
            [pedidoId]
        );
        pedido = resultadoPedido.rows[0];

        if (!pedido) {
            throw criarErro('Pedido não encontrado.', 404);
        }
        if (
            usuarioAutenticado.perfil !== 'administrador' &&
            Number(pedido.idusuario) !== usuarioAutenticado.idusuario
        ) {
            throw criarErro('Você não tem permissão para pagar este pedido.', 403);
        }
        if (
            pedido.status_pedido !== 'pendente' ||
            pedido.status_pagamento !== 'pendente'
        ) {
            throw criarErro(
                'Este pedido não está aguardando pagamento.',
                409
            );
        }
        if (pedido.idpreferencia && pedido.url_checkout) {
            await client.query('COMMIT');
            return {
                pedidoId: String(pedido.idpedido),
                checkoutUrl: pedido.url_checkout,
            };
        }

        itens = await client.query(
            `SELECT pp.idproduto, pp.quantidade, pp.preco_unitario, pr.nome
             FROM produto_pedido pp
             JOIN produto pr ON pr.idproduto = pp.idproduto
             WHERE pp.idpedido = $1
             ORDER BY pp.idproduto`,
            [pedidoId]
        );
        if (itens.rows.length === 0) {
            throw criarErro('O pedido não contém produtos.', 409);
        }

        const totalCentavos = itens.rows.reduce(
            (total, item) =>
                total + Math.round(Number(item.preco_unitario) * 100) *
                    Number(item.quantidade),
            0
        );
        if (
            !Number.isSafeInteger(totalCentavos) ||
            totalCentavos < 1 ||
            totalCentavos !== Math.round(Number(pedido.valor_pagamento) * 100) ||
            totalCentavos !== Math.round(Number(pedido.valor_total) * 100)
        ) {
            throw criarErro(
                'O valor dos itens não corresponde ao valor do pagamento.',
                409
            );
        }

        if (!pedido.idpreferencia) {
            const checkoutReservado = await client.query(
                `UPDATE pagamento
                 SET idpreferencia = $1
                 WHERE idpagamento = $2
                   AND status = 'pendente'
                   AND provedor = 'mercado_pago'
                 RETURNING idpagamento`,
                [
                    `pending-${pedido.idpagamento}`,
                    pedido.idpagamento,
                ]
            );
            if (!checkoutReservado.rows[0]) {
                throw criarErro(
                    'O pedido deixou de aguardar pagamento.',
                    409
                );
            }
        }

        await client.query('COMMIT');
    } catch (error) {
        try {
            await client.query('ROLLBACK');
        } catch (rollbackError) {
            console.error('Erro ao desfazer preparação do checkout:', rollbackError);
        }
        throw error;
    } finally {
        client.release();
    }

    const successUrl = criarUrlRetorno(
        configuracao.frontendUrl,
        pedido.idpedido,
        'approved'
    );
    const pendingUrl = criarUrlRetorno(
        configuracao.frontendUrl,
        pedido.idpedido,
        'pending'
    );
    const failureUrl = criarUrlRetorno(
        configuracao.frontendUrl,
        pedido.idpedido,
        'failure'
    );
    const preference = {
        items: itens.rows.map((item) => ({
            id: String(item.idproduto),
            title: item.nome,
            quantity: Number(item.quantidade),
            unit_price: Number(item.preco_unitario),
            currency_id: 'BRL',
        })),
        payer: {
            name: pedido.nome,
            email: pedido.email,
        },
        external_reference: String(pedido.idpagamento),
        notification_url: configuracao.webhookUrl,
        back_urls: {
            success: successUrl,
            pending: pendingUrl,
            failure: failureUrl,
        },
        metadata: {
            pedido_id: Number(pedido.idpedido),
            pagamento_id: Number(pedido.idpagamento),
        },
    };
    if (configuracao.frontendUrl.protocol === 'https:') {
        preference.auto_return = 'approved';
    }

    let resposta;
    try {
        resposta = await fetch(`${API_BASE_URL}/checkout/preferences`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${configuracao.accessToken}`,
                'Content-Type': 'application/json',
                'X-Idempotency-Key': criarChaveIdempotencia(
                    pedido.idpagamento
                ),
            },
            body: JSON.stringify(preference),
        });
    } catch (error) {
        console.error('Não foi possível conectar ao Mercado Pago:', error.message);
        throw criarErro(
            'Não foi possível conectar ao Mercado Pago. Tente novamente.',
            502
        );
    }

    const respostaGateway = await resposta.json().catch(() => null);
    if (!resposta.ok) {
        console.error(
            'Mercado Pago recusou a criação da preferência:',
            resposta.status,
            respostaGateway?.message || 'sem mensagem'
        );
        throw criarErro(
            'O Mercado Pago não conseguiu iniciar este pagamento.',
            502
        );
    }

    const checkoutUrl = configuracao.usarSandbox
        ? respostaGateway?.sandbox_init_point
        : respostaGateway?.init_point;
    if (
        typeof respostaGateway?.id !== 'string' ||
        typeof checkoutUrl !== 'string' ||
        !checkoutUrl.startsWith('https://')
    ) {
        throw criarErro(
            'O Mercado Pago retornou uma preferência de pagamento inválida.',
            502
        );
    }

    const atualizacaoPreferencia = await pool.query(
        `UPDATE pagamento
         SET idpreferencia = $1, url_checkout = $2
         WHERE idpagamento = $3
           AND status = 'pendente'
           AND provedor = 'mercado_pago'
         RETURNING idpagamento`,
        [respostaGateway.id, checkoutUrl, pedido.idpagamento]
    );
    if (!atualizacaoPreferencia.rows[0]) {
        throw criarErro(
            'O pedido deixou de aguardar pagamento. Consulte o status antes de tentar novamente.',
            409
        );
    }

    return {
        pedidoId: String(pedido.idpedido),
        checkoutUrl,
    };
}

function validarAssinaturaWebhook({ assinatura, requestId, paymentId, secret }) {
    if (
        typeof assinatura !== 'string' ||
        typeof requestId !== 'string' ||
        typeof paymentId !== 'string' ||
        !secret
    ) {
        return false;
    }

    const partes = Object.fromEntries(
        assinatura.split(',').map((parte) => {
            const [chave, ...valor] = parte.trim().split('=');
            return [chave, valor.join('=')];
        })
    );
    const timestamp = partes.ts;
    const assinaturaRecebida = partes.v1;
    if (
        !/^\d+$/.test(timestamp || '') ||
        !/^[a-f0-9]{64}$/i.test(assinaturaRecebida || '')
    ) {
        return false;
    }

    const manifest =
        `id:${paymentId.toLowerCase()};request-id:${requestId};ts:${timestamp};`;
    const assinaturaEsperada = crypto
        .createHmac('sha256', secret)
        .update(manifest)
        .digest();
    const assinaturaBytes = Buffer.from(assinaturaRecebida, 'hex');

    return assinaturaBytes.length === assinaturaEsperada.length &&
        crypto.timingSafeEqual(assinaturaBytes, assinaturaEsperada);
}

function converterStatusPagamento(status) {
    switch (status) {
        case 'approved':
            return 'aprovado';
        case 'rejected':
            return 'recusado';
        case 'cancelled':
            return 'cancelado';
        case 'refunded':
        case 'charged_back':
            return 'estornado';
        case 'pending':
        case 'in_process':
        case 'authorized':
            return 'pendente';
        default:
            return null;
    }
}

async function buscarPagamentoGateway(paymentId, accessToken) {
    let resposta;
    try {
        resposta = await fetch(
            `${API_BASE_URL}/v1/payments/${encodeURIComponent(paymentId)}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
    } catch (error) {
        console.error('Não foi possível consultar o pagamento no Mercado Pago:', error.message);
        throw criarErro('Falha ao consultar o pagamento no Mercado Pago.', 502);
    }

    if (!resposta.ok) {
        console.error(
            'Mercado Pago não retornou o pagamento da notificação:',
            resposta.status
        );
        throw criarErro('Não foi possível validar o pagamento recebido.', 502);
    }

    return resposta.json();
}

async function processarNotificacaoPagamento(paymentIdInformado) {
    const paymentId = String(paymentIdInformado || '');
    if (!/^[0-9]+$/.test(paymentId)) {
        throw criarErro('Identificador de pagamento inválido.');
    }

    const { accessToken } = obterConfiguracao();
    const pagamentoGateway = await buscarPagamentoGateway(
        paymentId,
        accessToken
    );
    const status = converterStatusPagamento(pagamentoGateway.status);
    const pagamentoId = Number(pagamentoGateway.external_reference);
    if (
        !Number.isSafeInteger(pagamentoId) ||
        pagamentoId < 1 ||
        !status
    ) {
        console.warn(
            'Notificação do Mercado Pago ignorada por referência/status inválido.'
        );
        return { ignorada: true };
    }

    const valorCentavos = Math.round(
        Number(pagamentoGateway.transaction_amount) * 100
    );
    if (
        !Number.isSafeInteger(valorCentavos) ||
        pagamentoGateway.currency_id !== 'BRL'
    ) {
        throw criarErro('Dados do pagamento recebido são inválidos.', 409);
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const resultado = await client.query(
            `SELECT pg.idpagamento, pg.idpedido, pg.valor, pg.status,
                    pg.identificador_externo, p.status AS status_pedido
             FROM pagamento pg
             JOIN pedido p ON p.idpedido = pg.idpedido
             WHERE pg.idpagamento = $1
               AND pg.provedor = 'mercado_pago'
             FOR UPDATE OF pg, p`,
            [pagamentoId]
        );
        const pagamento = resultado.rows[0];
        if (!pagamento) {
            await client.query('COMMIT');
            return { ignorada: true };
        }
        if (Math.round(Number(pagamento.valor) * 100) !== valorCentavos) {
            throw criarErro(
                'O valor recebido não corresponde ao pagamento do pedido.',
                409
            );
        }
        if (
            pagamento.identificador_externo &&
            pagamento.identificador_externo !== paymentId
        ) {
            throw criarErro(
                'O pedido já está associado a outro pagamento do Mercado Pago.',
                409
            );
        }
        const pagamentoDuplicado = await client.query(
            `SELECT idpagamento
             FROM pagamento
             WHERE provedor = 'mercado_pago'
               AND identificador_externo = $1
               AND idpagamento <> $2`,
            [paymentId, pagamentoId]
        );
        if (pagamentoDuplicado.rows[0]) {
            throw criarErro(
                'O pagamento do Mercado Pago já foi associado a outro pedido.',
                409
            );
        }

        const statusAtual = pagamento.status;
        if (
            statusAtual === 'estornado' ||
            (
                statusAtual === 'aprovado' &&
                !['aprovado', 'estornado'].includes(status)
            )
            || (
                ['recusado', 'cancelado'].includes(statusAtual) &&
                status !== 'aprovado'
            )
            || (
                status === 'estornado' &&
                statusAtual !== 'aprovado'
            )
        ) {
            await client.query('COMMIT');
            return { ignorada: true };
        }

        if (status === 'aprovado') {
            await client.query(
                `UPDATE pagamento
                 SET status = 'aprovado',
                     identificador_externo = $1,
                     data_pagamento = COALESCE($2, CURRENT_TIMESTAMP)
                 WHERE idpagamento = $3`,
                [
                    paymentId,
                    pagamentoGateway.date_approved || null,
                    pagamentoId,
                ]
            );
            if (pagamento.status_pedido === 'pendente') {
                await client.query(
                    `UPDATE pedido SET status = 'confirmado'
                     WHERE idpedido = $1`,
                    [pagamento.idpedido]
                );
                await client.query(
                    `UPDATE produto_pedido
                     SET quantidade_reservada = 0
                     WHERE idpedido = $1`,
                    [pagamento.idpedido]
                );
            } else if (pagamento.status_pedido === 'cancelado') {
                console.error(
                    `Pagamento ${paymentId} foi aprovado após o cancelamento do pedido ${pagamento.idpedido}; estorno/revisão manual necessário.`
                );
            }
        } else if (status === 'estornado') {
            await client.query(
                `UPDATE pagamento
                 SET status = 'estornado',
                     identificador_externo = $1
                 WHERE idpagamento = $2`,
                [paymentId, pagamentoId]
            );
        } else {
            await client.query(
                `UPDATE pagamento
                 SET status = $1,
                     identificador_externo = $2
                 WHERE idpagamento = $3`,
                [status, paymentId, pagamentoId]
            );
            if (
                ['recusado', 'cancelado'].includes(status) &&
                pagamento.status_pedido === 'pendente'
            ) {
                const reservas = await client.query(
                    `SELECT idproduto, quantidade_reservada
                     FROM produto_pedido
                     WHERE idpedido = $1
                     ORDER BY idproduto`,
                    [pagamento.idpedido]
                );
                for (const item of reservas.rows) {
                    await client.query(
                        `UPDATE produto
                         SET quantidade = quantidade + $1
                         WHERE idproduto = $2`,
                        [item.quantidade_reservada, item.idproduto]
                    );
                }
                await client.query(
                    `UPDATE produto_pedido
                     SET quantidade_reservada = 0
                     WHERE idpedido = $1`,
                    [pagamento.idpedido]
                );
                await client.query(
                    `UPDATE pedido SET status = 'cancelado'
                     WHERE idpedido = $1 AND status = 'pendente'`,
                    [pagamento.idpedido]
                );
            }
        }

        await client.query('COMMIT');
        return {
            ignorada: false,
            status,
            pedidoId: String(pagamento.idpedido),
        };
    } catch (error) {
        try {
            await client.query('ROLLBACK');
        } catch (rollbackError) {
            console.error('Erro ao desfazer atualização do pagamento:', rollbackError);
        }
        throw error;
    } finally {
        client.release();
    }
}

function obterSegredoWebhook() {
    if (!process.env.MERCADO_PAGO_WEBHOOK_SECRET) {
        throw criarErro(
            'A chave de assinatura do webhook não está configurada.',
            503
        );
    }
    return process.env.MERCADO_PAGO_WEBHOOK_SECRET;
}

module.exports = {
    criarCheckout,
    validarConfiguracao,
    processarNotificacaoPagamento,
    obterSegredoWebhook,
    validarAssinaturaWebhook,
    converterStatusPagamento,
};
