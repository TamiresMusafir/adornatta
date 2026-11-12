const crypto = require('node:crypto');
const { pool } = require('../database/connection');

const API_BASE_URL = 'https://api.mercadopago.com';
const CHECKOUT_TIMEOUT_MINUTES = 15;
const CHECKOUT_EXPIRATION_INTERVAL_MS = 30_000;
const CHECKOUT_EXPIRATION_LOCK = 1_447_311_438;
let expiracaoCheckoutsEmAndamento = false;

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
    const frontendUrl = process.env.FRONTEND_URL;

    if (!accessToken || !frontendUrl) {
        throw criarErro(
            'MERCADO_PAGO_ACCESS_TOKEN e FRONTEND_URL devem estar configurados para criar uma Order.',
            503
        );
    }

    let urlFrontend;
    try {
        urlFrontend = new URL(frontendUrl);
    } catch {
        throw criarErro('As URLs da integração de pagamento são inválidas.', 500);
    }

    if (!['http:', 'https:'].includes(urlFrontend.protocol)) {
        throw criarErro('A URL do frontend é inválida.', 500);
    }

    return {
        accessToken,
        frontendUrl: urlFrontend,
    };
}

function validarConfiguracao() {
    obterConfiguracao();
}

function criarChaveIdempotencia(idpagamento) {
    const bytes = crypto
        .createHash('sha256')
        .update(`adornatta:mercado-pago:order:${idpagamento}`)
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

function criarPayloadOrder(pedido, itens, totalCentavos, frontendUrl) {
    return {
        type: 'online',
        processing_mode: 'manual',
        capture_mode: 'automatic_async',
        total_amount: (totalCentavos / 100).toFixed(2),
        external_reference: String(pedido.idpagamento),
        items: itens.map((item) => ({
            title: item.nome,
            quantity: Number(item.quantidade),
            unit_price: (
                Math.round(Number(item.preco_unitario) * 100) / 100
            ).toFixed(2),
        })),
        payer: {
            email: pedido.email,
        },
        config: {
            online: {
                success_url: criarUrlRetorno(
                    frontendUrl,
                    pedido.idpedido,
                    'approved'
                ),
                pending_url: criarUrlRetorno(
                    frontendUrl,
                    pedido.idpedido,
                    'pending'
                ),
                failure_url: criarUrlRetorno(
                    frontendUrl,
                    pedido.idpedido,
                    'failure'
                ),
                ...(frontendUrl.protocol === 'https:'
                    ? { auto_return: 'approved' }
                    : {}),
            },
        },
        description: `Pedido Adornatta ${pedido.idpedido}`,
    };
}

async function criarCheckout(pedidoIdInformado, usuarioAutenticado) {
    const pedidoId = validarId(pedidoIdInformado, 'Pedido');
    const configuracao = obterConfiguracao();
    const client = await pool.connect();
    let pedido;
    let itens;
    let totalCentavos;

    try {
        await client.query('BEGIN');
        const resultadoPedido = await client.query(
            `SELECT p.idpedido, p.idusuario, p.valor_total,
                    p.status AS status_pedido, pg.idpagamento,
                    pg.valor AS valor_pagamento, pg.status AS status_pagamento,
                    pg.idpreferencia, pg.idorder, pg.url_checkout,
                    pg.checkout_expires_at,
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
        if (
            pedido.idorder &&
            !pedido.idorder.startsWith('pending-') &&
            pedido.url_checkout
        ) {
            if (
                !pedido.checkout_expires_at ||
                new Date(pedido.checkout_expires_at).getTime() <= Date.now()
            ) {
                throw criarErro(
                    'Este checkout expirou ou não possui validade registrada. Crie um novo pedido para tentar novamente.',
                    409
                );
            }
            await client.query('COMMIT');
            return {
                pedidoId: String(pedido.idpedido),
                checkoutUrl: pedido.url_checkout,
                checkoutExpiresAt: pedido.checkout_expires_at,
            };
        }
        if (pedido.idpreferencia && pedido.url_checkout && !pedido.idorder) {
            throw criarErro(
                'Este pedido já possui um checkout legado ativo. Conclua ou cancele esse pagamento antes de criar uma Order.',
                409
            );
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

        totalCentavos = itens.rows.reduce(
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

        if (!pedido.idorder) {
            const checkoutReservado = await client.query(
                `UPDATE pagamento
                 SET idorder = $1
                 WHERE idpagamento = $2
                   AND status = 'pendente'
                   AND provedor = 'mercado_pago'
                   AND idorder IS NULL
                 RETURNING idpagamento, checkout_expires_at`,
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

    const order = criarPayloadOrder(
        pedido,
        itens.rows,
        totalCentavos,
        configuracao.frontendUrl
    );

    let resposta;
    try {
        resposta = await fetch(`${API_BASE_URL}/v1/orders`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${configuracao.accessToken}`,
                'Content-Type': 'application/json',
                'X-Idempotency-Key': criarChaveIdempotencia(
                    pedido.idpagamento
                ),
            },
            body: JSON.stringify(order),
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
            'Mercado Pago recusou a criação da order:',
            resposta.status,
            respostaGateway?.message || 'sem mensagem'
        );
        throw criarErro(
            'O Mercado Pago não conseguiu iniciar este pagamento.',
            502
        );
    }

    const checkoutUrl = respostaGateway?.checkout_url;
    if (
        typeof respostaGateway?.id !== 'string' ||
        !/^[A-Za-z0-9_-]{1,100}$/.test(respostaGateway.id) ||
        typeof checkoutUrl !== 'string' ||
        !checkoutUrl.startsWith('https://')
    ) {
        throw criarErro(
            'O Mercado Pago retornou uma order ou URL de checkout inválida.',
            502
        );
    }

    const atualizacaoOrder = await pool.query(
        `UPDATE pagamento
         SET idorder = $1, url_checkout = $2,
             checkout_expires_at = CURRENT_TIMESTAMP + ($5 * INTERVAL '1 minute')
         WHERE idpagamento = $3
           AND status = 'pendente'
           AND provedor = 'mercado_pago'
           AND idorder IN ($4, $1)
         RETURNING idpagamento`,
        [
            respostaGateway.id,
            checkoutUrl,
            pedido.idpagamento,
            `pending-${pedido.idpagamento}`,
            CHECKOUT_TIMEOUT_MINUTES,
        ]
    );
    if (!atualizacaoOrder.rows[0]) {
        throw criarErro(
            'O pedido deixou de aguardar pagamento. Consulte o status antes de tentar novamente.',
            409
        );
    }

    return {
        pedidoId: String(pedido.idpedido),
        checkoutUrl,
        checkoutExpiresAt: atualizacaoOrder.rows[0].checkout_expires_at,
    };
}

function validarAssinaturaWebhook({ assinatura, requestId, resourceId, secret }) {
    if (
        typeof assinatura !== 'string' ||
        typeof requestId !== 'string' ||
        typeof resourceId !== 'string' ||
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
        `id:${resourceId.toLowerCase()};request-id:${requestId};ts:${timestamp};`;
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

function converterStatusOrder(status) {
    switch (status) {
        case 'processed':
            return 'aprovado';
        case 'failed':
            return 'recusado';
        case 'canceled':
            return 'cancelado';
        case 'refunded':
            return 'estornado';
        case 'created':
        case 'action_required':
        case 'processing':
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

async function buscarOrderGateway(orderId, accessToken) {
    let resposta;
    try {
        resposta = await fetch(
            `${API_BASE_URL}/v1/orders/${encodeURIComponent(orderId)}`,
            {
                headers: {
                    Authorization: 'Bearer ' + accessToken,
                },
            }
        );
    } catch (error) {
        console.error('Não foi possível consultar a order no Mercado Pago:', error.message);
        throw criarErro('Falha ao consultar a order no Mercado Pago.', 502);
    }

    if (!resposta.ok) {
        console.error(
            'Mercado Pago não retornou a order da notificação:',
            resposta.status
        );
        throw criarErro('Não foi possível validar a order recebida.', 502);
    }

    return resposta.json();
}

async function cancelarOrderGateway(orderId, accessToken) {
    let resposta;
    try {
        resposta = await fetch(
            `${API_BASE_URL}/v1/orders/${encodeURIComponent(orderId)}/cancel`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'X-Idempotency-Key': criarChaveIdempotencia(
                        `cancel:${orderId}`
                    ),
                },
            }
        );
    } catch (error) {
        console.error('Não foi possível cancelar a order no Mercado Pago:', error.message);
        throw criarErro('Falha ao cancelar a order no Mercado Pago.', 502);
    }

    if (!resposta.ok) {
        console.error(
            'Mercado Pago não confirmou o cancelamento da order:',
            resposta.status
        );
        throw criarErro('Não foi possível cancelar a order no Mercado Pago.', 502);
    }
}

async function aplicarStatusPagamento({
    pagamentoId,
    externalId,
    orderId,
    status,
    valorCentavos,
    moeda,
    dataPagamento,
}) {
    if (!Number.isSafeInteger(pagamentoId) || pagamentoId < 1 || !status) {
        console.warn(
            'Notificação do Mercado Pago ignorada por referência/status inválido.'
        );
        return { ignorada: true };
    }
    if (!Number.isSafeInteger(valorCentavos) || moeda !== 'BRL') {
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
               AND ($2::varchar IS NULL OR pg.idorder = $2)
             FOR UPDATE OF pg, p`,
            [pagamentoId, orderId || null]
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
            externalId &&
            pagamento.identificador_externo &&
            pagamento.identificador_externo !== externalId
        ) {
            throw criarErro(
                'O pedido já está associado a outro pagamento do Mercado Pago.',
                409
            );
        }
        const pagamentoDuplicado = externalId
            ? await client.query(
                `SELECT idpagamento
                 FROM pagamento
                 WHERE provedor = 'mercado_pago'
                   AND identificador_externo = $1
                   AND idpagamento <> $2`,
                [externalId, pagamentoId]
            )
            : { rows: [] };
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
                     identificador_externo = COALESCE($1, identificador_externo),
                     data_pagamento = COALESCE($2, CURRENT_TIMESTAMP)
                 WHERE idpagamento = $3`,
                [
                    externalId,
                    dataPagamento || null,
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
                    `Pagamento ${externalId || orderId} foi aprovado após o cancelamento do pedido ${pagamento.idpedido}; estorno/revisão manual necessário.`
                );
            }
        } else if (status === 'estornado') {
            await client.query(
                `UPDATE pagamento
                 SET status = 'estornado',
                     identificador_externo = COALESCE($1, identificador_externo)
                 WHERE idpagamento = $2`,
                [externalId, pagamentoId]
            );
        } else {
            await client.query(
                `UPDATE pagamento
                 SET status = $1,
                     identificador_externo = COALESCE($2, identificador_externo)
                 WHERE idpagamento = $3`,
                [status, externalId, pagamentoId]
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
    return aplicarStatusPagamento({
        pagamentoId: Number(pagamentoGateway.external_reference),
        externalId: paymentId,
        status: converterStatusPagamento(pagamentoGateway.status),
        valorCentavos: Math.round(
            Number(pagamentoGateway.transaction_amount) * 100
        ),
        moeda: pagamentoGateway.currency_id,
        dataPagamento: pagamentoGateway.date_approved,
    });
}

async function processarNotificacaoOrder(orderIdInformado) {
    const orderId = String(orderIdInformado || '');
    if (!/^[A-Za-z0-9_-]{1,100}$/.test(orderId)) {
        throw criarErro('Identificador de order inválido.');
    }

    const { accessToken } = obterConfiguracao();
    const order = await buscarOrderGateway(orderId, accessToken);
    if (order.id !== orderId) {
        throw criarErro('A order consultada não corresponde à notificação.', 409);
    }
    const pagamentoExterno = order.transactions?.payments?.[0];
    return aplicarStatusPagamento({
        pagamentoId: Number(order.external_reference),
        externalId: pagamentoExterno?.id
            ? String(pagamentoExterno.id)
            : null,
        orderId,
        status: converterStatusOrder(order.status),
        valorCentavos: Math.round(Number(order.total_amount) * 100),
        moeda: order.currency,
        dataPagamento: pagamentoExterno?.date_approved,
    });
}

async function expirarCheckout(order, accessToken) {
    await processarNotificacaoOrder(order.idorder);

    const pagamentoAtual = await pool.query(
        `SELECT pg.status AS status_pagamento
         FROM pagamento pg
         WHERE pg.idpagamento = $1
           AND pg.idorder = $2`,
        [order.idpagamento, order.idorder]
    );
    if (pagamentoAtual.rows[0]?.status_pagamento !== 'pendente') {
        return;
    }

    await cancelarOrderGateway(order.idorder, accessToken);
    await processarNotificacaoOrder(order.idorder);

    const pedidoAtual = await pool.query(
        `SELECT p.status AS status_pedido, pg.status AS status_pagamento
         FROM pagamento pg
         JOIN pedido p ON p.idpedido = pg.idpedido
         WHERE pg.idpagamento = $1
           AND pg.idorder = $2`,
        [order.idpagamento, order.idorder]
    );
    if (
        pedidoAtual.rows[0]?.status_pedido === 'pendente' ||
        pedidoAtual.rows[0]?.status_pagamento === 'pendente'
    ) {
        console.error(
            `O Mercado Pago não confirmou o cancelamento do checkout expirado do pagamento ${order.idpagamento}.`
        );
    }
}

async function expirarCheckoutsPendentes() {
    if (expiracaoCheckoutsEmAndamento) {
        return;
    }
    expiracaoCheckoutsEmAndamento = true;

    let client;
    let lockAcquired = false;
    try {
        const { accessToken } = obterConfiguracao();
        client = await pool.connect();
        const lock = await client.query(
            'SELECT pg_try_advisory_lock($1, $2) AS adquirido',
            [CHECKOUT_EXPIRATION_LOCK, 1]
        );
        lockAcquired = lock.rows[0].adquirido;
        if (!lockAcquired) {
            return;
        }

        const expirados = await client.query(
            `SELECT pg.idpagamento, pg.idorder
             FROM pagamento pg
             JOIN pedido p ON p.idpedido = pg.idpedido
             WHERE pg.provedor = 'mercado_pago'
               AND pg.status = 'pendente'
               AND p.status = 'pendente'
               AND pg.idorder IS NOT NULL
               AND pg.idorder NOT LIKE 'pending-%'
               AND pg.checkout_expires_at <= CURRENT_TIMESTAMP
             ORDER BY pg.checkout_expires_at, pg.idpagamento
             LIMIT 50`
        );

        for (const order of expirados.rows) {
            try {
                await expirarCheckout(order, accessToken);
            } catch (error) {
                console.error(
                    `Falha ao expirar checkout do pagamento ${order.idpagamento}:`,
                    error.message
                );
            }
        }
    } catch (error) {
        console.error('Falha ao processar checkouts expirados:', error.message);
    } finally {
        if (client) {
            if (lockAcquired) {
                try {
                    await client.query('SELECT pg_advisory_unlock($1, $2)', [
                        CHECKOUT_EXPIRATION_LOCK,
                        1,
                    ]);
                } catch (error) {
                    console.error(
                        'Falha ao liberar o lock de expiração de checkout:',
                        error.message
                    );
                }
            }
            client.release();
        }
        expiracaoCheckoutsEmAndamento = false;
    }
}

function iniciarExpiracaoCheckouts() {
    void expirarCheckoutsPendentes();
    const timer = setInterval(
        expirarCheckoutsPendentes,
        CHECKOUT_EXPIRATION_INTERVAL_MS
    );
    timer.unref();
    return timer;
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
    iniciarExpiracaoCheckouts,
    expirarCheckoutsPendentes,
    CHECKOUT_TIMEOUT_MINUTES,
    validarConfiguracao,
    processarNotificacaoPagamento,
    processarNotificacaoOrder,
    obterSegredoWebhook,
    validarAssinaturaWebhook,
    converterStatusPagamento,
    converterStatusOrder,
    criarPayloadOrder,
    criarChaveIdempotencia,
};
