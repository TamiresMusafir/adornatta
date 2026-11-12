const { pool } = require('../database/connection');
const { validarCepExistente } = require('./cepService');

const statusEntrada = {
    'Em análise': 'pendente',
    Confirmado: 'confirmado',
    'Em preparação': 'em_preparacao',
    Enviado: 'enviado',
    Entregue: 'entregue',
    Cancelado: 'cancelado',
    pendente: 'pendente',
    confirmado: 'confirmado',
    em_preparacao: 'em_preparacao',
    enviado: 'enviado',
    entregue: 'entregue',
    cancelado: 'cancelado',
};

const statusSaida = {
    pendente: 'Em análise',
    confirmado: 'Confirmado',
    em_preparacao: 'Em preparação',
    enviado: 'Enviado',
    entregue: 'Entregue',
    cancelado: 'Cancelado',
};

const transicoesPedido = {
    pendente: ['confirmado', 'em_preparacao', 'cancelado'],
    confirmado: ['em_preparacao', 'cancelado'],
    em_preparacao: ['enviado', 'cancelado'],
    enviado: ['entregue'],
    entregue: [],
    cancelado: [],
};

function criarErro(mensagem, statusCode = 400) {
    const erro = new Error(mensagem);
    erro.statusCode = statusCode;
    return erro;
}

async function rollback(client) {
    try {
        await client.query('ROLLBACK');
    } catch (error) {
        console.error('Erro ao desfazer transação do pedido:', error);
    }
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

function validarItensPedido(itens) {
    if (!Array.isArray(itens) || itens.length === 0) {
        throw criarErro('O pedido precisa conter pelo menos um produto.');
    }

    const quantidades = new Map();
    for (const item of itens) {
        if (!item || typeof item !== 'object' || Array.isArray(item)) {
            throw criarErro('Item do pedido inválido.');
        }

        const produtoId = validarId(item.produtoId, 'Produto');
        const quantidade = item.quantidade;
        if (
            !Number.isSafeInteger(quantidade) ||
            quantidade < 1 ||
            quantidade > 2147483647
        ) {
            throw criarErro('Quantidade do item inválida.');
        }

        const total = (quantidades.get(produtoId) || 0) + quantidade;
        if (!Number.isSafeInteger(total) || total > 2147483647) {
            throw criarErro('Quantidade total do produto inválida.');
        }
        quantidades.set(produtoId, total);
    }

    return [...quantidades.entries()]
        .sort(([produtoA], [produtoB]) => produtoA - produtoB)
        .map(([produtoId, quantidade]) => ({ produtoId, quantidade }));
}

function validarPagamento(valor) {
    if (typeof valor !== 'string' || !valor.trim()) {
        throw criarErro('Forma de pagamento é obrigatória.');
    }

    const forma = valor.trim();
    if (/pix/i.test(forma)) {
        return 'Pix';
    }
    if (/crédito/i.test(forma)) {
        return 'Cartão de crédito';
    }
    if (/débito/i.test(forma)) {
        return 'Cartão de débito';
    }
    if (/boleto/i.test(forma)) {
        return 'Boleto';
    }
    if (forma.length > 20) {
        throw criarErro('Forma de pagamento inválida.');
    }

    return forma;
}

function validarData(data) {
    if (data === undefined || data === null || data === '') {
        return null;
    }

    if (typeof data !== 'string' || Number.isNaN(Date.parse(data))) {
        throw criarErro('Data do pedido inválida.');
    }

    return data;
}

function validarEndereco(dados) {
    if (!dados || typeof dados !== 'object' || Array.isArray(dados)) {
        throw criarErro('Endereço de entrega é obrigatório.');
    }

    const ufInformada = dados.uf || dados.estado;
    if (
        typeof dados.logradouro !== 'string' ||
        typeof dados.numero !== 'string' ||
        typeof dados.bairro !== 'string' ||
        typeof dados.cidade !== 'string' ||
        typeof ufInformada !== 'string' ||
        typeof dados.cep !== 'string' ||
        (
            dados.complemento !== undefined &&
            dados.complemento !== null &&
            typeof dados.complemento !== 'string'
        )
    ) {
        throw criarErro('Endereço de entrega inválido.');
    }

    const endereco = {
        logradouro: String(dados.logradouro || '').trim(),
        numero: String(dados.numero || '').trim(),
        complemento: dados.complemento
            ? String(dados.complemento).trim()
            : null,
        bairro: String(dados.bairro || '').trim(),
        cidade: String(dados.cidade || '').trim(),
        uf: ufInformada.trim().toUpperCase(),
        cep: dados.cep.trim().replace('-', ''),
    };

    if (
        !endereco.logradouro ||
        endereco.logradouro.length > 100 ||
        !endereco.numero ||
        endereco.numero.length > 10 ||
        (endereco.complemento && endereco.complemento.length > 50) ||
        !endereco.bairro ||
        endereco.bairro.length > 60 ||
        !endereco.cidade ||
        endereco.cidade.length > 60 ||
        !/^[A-Z]{2}$/.test(endereco.uf) ||
        !/^\d{5}-?\d{3}$/.test(dados.cep.trim())
    ) {
        throw criarErro('Endereço de entrega inválido.');
    }

    return endereco;
}

async function obterEndereco(idusuario, dadosEndereco) {
    if (dadosEndereco) {
        return validarEndereco(dadosEndereco);
    }

    const resultado = await pool.query(
        `SELECT logradouro, numero, complemento, bairro, cidade, uf, cep
         FROM endereco_usuario
         WHERE idusuario = $1
         ORDER BY idendereco DESC
         LIMIT 1`,
        [idusuario]
    );

    if (!resultado.rows[0]) {
        throw criarErro('Cadastre ou informe um endereço de entrega.');
    }

    return validarEndereco(resultado.rows[0]);
}

async function validarUsuario(client, idusuario) {
    const resultado = await client.query(
        'SELECT idusuario FROM usuario WHERE idusuario = $1',
        [idusuario]
    );
    if (!resultado.rows[0]) {
        throw criarErro('Usuário não encontrado.', 404);
    }
}

function montarPedido(row) {
    const endereco = row.logradouro_entrega
        ? {
            logradouro: row.logradouro_entrega,
            numero: row.numero_entrega,
            complemento: row.complemento_entrega,
            bairro: row.bairro_entrega,
            cidade: row.cidade_entrega,
            uf: row.uf_entrega,
            estado: row.uf_entrega,
            cep: row.cep_entrega,
        }
        : null;

    let formaPagamento = row.forma_pagamento || null;
    if (formaPagamento && row.bandeira) {
        formaPagamento = `${formaPagamento} - ${row.bandeira}`;
    }

    return {
        id: String(row.idpedido),
        usuarioId: String(row.idusuario),
        data: row.data,
        valorTotal: Number(row.valor_total),
        status: statusSaida[row.status] || row.status,
        formaPagamentoId: row.idformapagamento
            ? String(row.idformapagamento)
            : undefined,
        formaPagamento,
        statusPagamento: row.status_pagamento || null,
        checkoutExpiraEm: row.checkout_expires_at || null,
        checkoutAtivo: Boolean(
            (row.idorder || row.idpreferencia) &&
            row.status_pagamento === 'pendente' &&
            (
                !row.checkout_expires_at ||
                new Date(row.checkout_expires_at).getTime() > Date.now()
            )
        ),
        enderecoEntrega: endereco,
    };
}

const consultaPedidos = `
    SELECT p.idpedido, p.data, p.valor_total, p.status, p.idusuario,
           p.logradouro_entrega, p.numero_entrega, p.complemento_entrega,
           p.bairro_entrega, p.cidade_entrega, p.uf_entrega, p.cep_entrega,
           pg.forma_pagamento, pg.status AS status_pagamento,
           pg.idpreferencia, pg.idorder, pg.checkout_expires_at,
           fp.bandeira, fp.idformapagamento
    FROM pedido p
    LEFT JOIN LATERAL (
        SELECT idformapagamento, forma_pagamento, status,
               idpreferencia, idorder, checkout_expires_at
        FROM pagamento
        WHERE idpedido = p.idpedido
        ORDER BY idpagamento DESC
        LIMIT 1
    ) pg ON TRUE
    LEFT JOIN forma_pagamento_usuario fp
        ON fp.idformapagamento = pg.idformapagamento
`;

async function criarPedido(dados, usuarioAutenticado) {
    if (!dados || typeof dados !== 'object' || Array.isArray(dados)) {
        throw criarErro('Dados do pedido inválidos.');
    }

    const idusuario = usuarioAutenticado.perfil === 'administrador'
        ? validarId(dados.usuarioId, 'Usuário')
        : usuarioAutenticado.idusuario;
    const enderecoInformado = dados.enderecoEntrega || dados.endereco;
    const formaPagamento = validarPagamento(dados.formaPagamento);
    const formaPagamentoId = dados.formaPagamentoId
        ? validarId(dados.formaPagamentoId, 'Forma de pagamento')
        : null;
    const itens = validarItensPedido(dados.itens);

    const statusInicial = dados.status === undefined
        ? 'pendente'
        : statusEntrada[dados.status];
    if (statusInicial !== 'pendente') {
        throw criarErro(
            'O pedido deve iniciar em análise e aguardar a confirmação do pagamento.'
        );
    }

    const data = validarData(dados.data);
    const endereco = await obterEndereco(idusuario, enderecoInformado);
    await validarCepExistente(endereco.cep);

    const client = await pool.connect();
    let pedidoId;
    try {
        await client.query('BEGIN');
        await validarUsuario(client, idusuario);

        const produtos = await client.query(
            `SELECT idproduto, preco_unitario, quantidade
             FROM produto
             WHERE idproduto = ANY($1::integer[])
             ORDER BY idproduto
             FOR UPDATE`,
            [itens.map((item) => item.produtoId)]
        );
        const produtosPorId = new Map(
            produtos.rows.map((produto) => [
                Number(produto.idproduto),
                produto,
            ])
        );
        if (produtosPorId.size !== itens.length) {
            throw criarErro('Um ou mais produtos não foram encontrados.', 404);
        }

        let totalCentavos = 0;
        const itensComPreco = itens.map((item) => {
            const produto = produtosPorId.get(item.produtoId);
            if (produto.quantidade < item.quantidade) {
                throw criarErro(
                    `Estoque insuficiente para o produto ${item.produtoId}.`,
                    409
                );
            }

            const precoCentavos = Math.round(
                Number(produto.preco_unitario) * 100
            );
            totalCentavos += precoCentavos * item.quantidade;
            if (
                !Number.isSafeInteger(totalCentavos) ||
                totalCentavos > 9999999999
            ) {
                throw criarErro('Valor total do pedido inválido.');
            }

            return {
                ...item,
                precoUnitario: precoCentavos / 100,
            };
        });
        if (dados.totalEsperado !== undefined) {
            if (
                typeof dados.totalEsperado !== 'number' ||
                !Number.isFinite(dados.totalEsperado) ||
                dados.totalEsperado < 0
            ) {
                throw criarErro('Total esperado do pedido inválido.');
            }
            if (
                Math.round(dados.totalEsperado * 100) !== totalCentavos
            ) {
                throw criarErro(
                    'Os preços do carrinho mudaram. Atualize os produtos antes de pagar.',
                    409
                );
            }
        }
        const total = totalCentavos / 100;

        if (formaPagamentoId) {
            const forma = await client.query(
                `SELECT idformapagamento
                 FROM forma_pagamento_usuario
                 WHERE idformapagamento = $1
                   AND idusuario = $2
                   AND ativo = TRUE`,
                [formaPagamentoId, idusuario]
            );
            if (!forma.rows[0]) {
                throw criarErro('Forma de pagamento não encontrada.', 404);
            }
        }

        const pedido = await client.query(
            `INSERT INTO pedido
                (data, valor_total, status, idusuario, logradouro_entrega,
                 numero_entrega, complemento_entrega, bairro_entrega,
                 cidade_entrega, uf_entrega, cep_entrega)
             VALUES (COALESCE($1::timestamptz, CURRENT_TIMESTAMP), $2, $3,
                     $4, $5, $6, $7, $8, $9, $10, $11)
             RETURNING idpedido`,
            [
                data,
                total,
                'pendente',
                idusuario,
                endereco.logradouro,
                endereco.numero,
                endereco.complemento,
                endereco.bairro,
                endereco.cidade,
                endereco.uf,
                endereco.cep,
            ]
        );

        await client.query(
            `INSERT INTO pagamento
                (idpedido, idformapagamento, valor, status,
                 forma_pagamento, provedor)
             VALUES ($1, $2, $3, 'pendente', $4, 'mercado_pago')`,
            [pedido.rows[0].idpedido, formaPagamentoId, total, formaPagamento]
        );

        pedidoId = pedido.rows[0].idpedido;

        for (const item of itensComPreco) {
            await client.query(
                `INSERT INTO produto_pedido
                    (idproduto, idpedido, quantidade,
                     quantidade_reservada, preco_unitario)
                 VALUES ($1, $2, $3, $3, $4)`,
                [
                    item.produtoId,
                    pedidoId,
                    item.quantidade,
                    item.precoUnitario,
                ]
            );
            await client.query(
                `UPDATE produto
                 SET quantidade = quantidade - $1
                 WHERE idproduto = $2`,
                [item.quantidade, item.produtoId]
            );
        }

        await client.query('COMMIT');
    } catch (error) {
        await rollback(client);
        throw error;
    } finally {
        client.release();
    }

    return buscarPedidoPorId(pedidoId);
}

async function buscarPedidoPorId(id, usuarioAutenticado) {
    const pedidoId = validarId(id, 'Pedido');
    if (usuarioAutenticado) {
        await verificarAcessoPedido(pedidoId, usuarioAutenticado);
    }

    const resultado = await pool.query(
        `${consultaPedidos} WHERE p.idpedido = $1`,
        [pedidoId]
    );

    return resultado.rows[0] ? montarPedido(resultado.rows[0]) : null;
}

async function listarPedidos(usuarioAutenticado, usuarioIdFiltro) {
    const parametros = [];
    let filtro = '';

    if (usuarioAutenticado.perfil === 'administrador') {
        if (usuarioIdFiltro !== undefined) {
            parametros.push(validarId(usuarioIdFiltro, 'Usuário'));
            filtro = 'WHERE p.idusuario = $1';
        }
    } else {
        parametros.push(usuarioAutenticado.idusuario);
        filtro = 'WHERE p.idusuario = $1';
    }

    const resultado = await pool.query(
        `${consultaPedidos} ${filtro} ORDER BY p.data DESC, p.idpedido DESC`,
        parametros
    );

    return resultado.rows.map(montarPedido);
}

async function atualizarPedido(id, dados) {
    const pedidoId = validarId(id, 'Pedido');
    if (!dados || typeof dados !== 'object' || Array.isArray(dados)) {
        throw criarErro('Dados do pedido inválidos.');
    }

    const status = statusEntrada[dados.status];
    if (
        !status ||
        !Object.prototype.hasOwnProperty.call(transicoesPedido, status)
    ) {
        throw criarErro('Status do pedido inválido.');
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const pedido = await client.query(
            `SELECT p.status, pg.status AS status_pagamento,
                    pg.provedor, pg.idpreferencia, pg.idorder
             FROM pedido p
             LEFT JOIN LATERAL (
                 SELECT status, provedor, idpreferencia, idorder
                 FROM pagamento
                 WHERE idpedido = p.idpedido
                 ORDER BY idpagamento DESC
                 LIMIT 1
             ) pg ON TRUE
             WHERE p.idpedido = $1
             FOR UPDATE OF p`,
            [pedidoId]
        );

        if (!pedido.rows[0]) {
            await client.query('ROLLBACK');
            return null;
        }

        const atual = pedido.rows[0];
        if (atual.status !== status) {
            if (!transicoesPedido[atual.status]?.includes(status)) {
                throw criarErro(
                    `Não é possível alterar o pedido de "${statusSaida[atual.status] || atual.status}" para "${statusSaida[status]}".`,
                    409
                );
            }

            if (
                [
                    'confirmado',
                    'em_preparacao',
                    'enviado',
                    'entregue',
                ].includes(status) &&
                (
                    atual.status_pagamento !== 'aprovado' ||
                    atual.provedor !== 'mercado_pago'
                )
            ) {
                throw criarErro(
                    'O pedido só pode avançar após a confirmação do pagamento pelo Mercado Pago.',
                    409
                );
            }

            if (status === 'cancelado') {
                if (atual.status_pagamento === 'aprovado') {
                    throw criarErro(
                        'O pagamento foi aprovado. Faça o estorno antes de cancelar o pedido e devolver os itens ao estoque.',
                        409
                    );
                }
                if (
                    atual.status_pagamento === 'pendente' &&
                    (atual.idorder || atual.idpreferencia)
                ) {
                    throw criarErro(
                        'Este pedido possui um checkout ativo. Aguarde a atualização do Mercado Pago antes de cancelar.',
                        409
                    );
                }

                const itens = await client.query(
                    `SELECT idproduto, quantidade_reservada
                     FROM produto_pedido
                     WHERE idpedido = $1
                     ORDER BY idproduto`,
                    [pedidoId]
                );
                for (const item of itens.rows) {
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
                    [pedidoId]
                );
                await client.query(
                    `UPDATE pagamento
                     SET status = 'cancelado'
                     WHERE idpedido = $1 AND status = 'pendente'`,
                    [pedidoId]
                );
            }

            await client.query(
                'UPDATE pedido SET status = $1 WHERE idpedido = $2',
                [status, pedidoId]
            );
        }

        await client.query('COMMIT');
    } catch (error) {
        await rollback(client);
        throw error;
    } finally {
        client.release();
    }

    return buscarPedidoPorId(pedidoId);
}

async function verificarAcessoPedido(id, usuarioAutenticado, client = pool) {
    const pedidoId = validarId(id, 'Pedido');
    const resultado = await client.query(
        'SELECT idusuario FROM pedido WHERE idpedido = $1',
        [pedidoId]
    );

    if (!resultado.rows[0]) {
        throw criarErro('Pedido não encontrado.', 404);
    }

    if (
        usuarioAutenticado.perfil !== 'administrador' &&
        Number(resultado.rows[0].idusuario) !== usuarioAutenticado.idusuario
    ) {
        throw criarErro('Você não tem permissão para acessar este pedido.', 403);
    }

    return pedidoId;
}

async function criarItemPedido(dados, usuarioAutenticado) {
    if (!dados || typeof dados !== 'object' || Array.isArray(dados)) {
        throw criarErro('Dados do item inválidos.');
    }

    const pedidoId = validarId(dados.pedidoId, 'Pedido');
    const produtoId = validarId(dados.produtoId, 'Produto');
    const quantidade = dados.quantidade;
    if (!Number.isSafeInteger(quantidade) || quantidade < 1) {
        throw criarErro('Quantidade do item inválida.');
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await verificarAcessoPedido(pedidoId, usuarioAutenticado, client);
        const estadoPedido = await client.query(
            `SELECT p.status, pg.status AS status_pagamento,
                    pg.idpreferencia, pg.idorder
             FROM pedido p
             LEFT JOIN LATERAL (
                 SELECT status, idpreferencia, idorder
                 FROM pagamento
                 WHERE idpedido = p.idpedido
                 ORDER BY idpagamento DESC
                 LIMIT 1
             ) pg ON TRUE
             WHERE p.idpedido = $1
             FOR UPDATE OF p`,
            [pedidoId]
        );
        if (!estadoPedido.rows[0]) {
            throw criarErro('Pedido não encontrado.', 404);
        }
        if (
            estadoPedido.rows[0].status !== 'pendente' ||
            estadoPedido.rows[0].status_pagamento !== 'pendente' ||
            estadoPedido.rows[0].idpreferencia ||
            estadoPedido.rows[0].idorder
        ) {
            throw criarErro(
                'Não é possível alterar itens após iniciar o checkout ou confirmar o pagamento.',
                409
            );
        }

        const produto = await client.query(
            `SELECT preco_unitario, quantidade
             FROM produto
             WHERE idproduto = $1
             FOR UPDATE`,
            [produtoId]
        );
        if (!produto.rows[0]) {
            throw criarErro('Produto não encontrado.', 404);
        }
        if (produto.rows[0].quantidade < quantidade) {
            throw criarErro('Estoque insuficiente.', 409);
        }

        await client.query(
            `UPDATE produto
             SET quantidade = quantidade - $1
             WHERE idproduto = $2`,
            [quantidade, produtoId]
        );

        await client.query(
            `INSERT INTO produto_pedido
                (idproduto, idpedido, quantidade,
                 quantidade_reservada, preco_unitario)
             VALUES ($1, $2, $3, $3, $4)
             ON CONFLICT (idproduto, idpedido)
             DO UPDATE SET
                quantidade = produto_pedido.quantidade + EXCLUDED.quantidade,
                quantidade_reservada = produto_pedido.quantidade_reservada
                    + EXCLUDED.quantidade_reservada,
                preco_unitario = EXCLUDED.preco_unitario`,
            [
                produtoId,
                pedidoId,
                quantidade,
                Number(produto.rows[0].preco_unitario),
            ]
        );
        await client.query(
            `UPDATE pedido
             SET valor_total = (
                 SELECT COALESCE(SUM(quantidade * preco_unitario), 0)
                 FROM produto_pedido
                 WHERE idpedido = $1
             )
             WHERE idpedido = $1`,
            [pedidoId]
        );
        await client.query(
            `UPDATE pagamento
             SET valor = (
                 SELECT valor_total FROM pedido WHERE idpedido = $1
             )
             WHERE idpedido = $1 AND status = 'pendente'`,
            [pedidoId]
        );

        const resultado = await client.query(
            `SELECT pp.idpedido, pp.idproduto, pp.quantidade,
                    pp.preco_unitario, p.nome
             FROM produto_pedido pp
             JOIN produto p ON p.idproduto = pp.idproduto
             WHERE pp.idpedido = $1 AND pp.idproduto = $2`,
            [pedidoId, produtoId]
        );
        await client.query('COMMIT');

        return montarItem(resultado.rows[0]);
    } catch (error) {
        await rollback(client);
        throw error;
    } finally {
        client.release();
    }
}

async function removerItemPedido(pedidoIdInformado, produtoIdInformado, usuarioAutenticado) {
    const pedidoId = validarId(pedidoIdInformado, 'Pedido');
    const produtoId = validarId(produtoIdInformado, 'Produto');
    const client = await pool.connect();

    try {
        await client.query('BEGIN');
        await verificarAcessoPedido(pedidoId, usuarioAutenticado, client);

        const pedido = await client.query(
            `SELECT p.status, pg.status AS status_pagamento,
                    pg.idpreferencia, pg.idorder
             FROM pedido p
             LEFT JOIN LATERAL (
                 SELECT status, idpreferencia, idorder
                 FROM pagamento
                 WHERE idpedido = p.idpedido
                 ORDER BY idpagamento DESC
                 LIMIT 1
             ) pg ON TRUE
             WHERE p.idpedido = $1
             FOR UPDATE OF p`,
            [pedidoId]
        );
        if (
            pedido.rows[0].status !== 'pendente' ||
            pedido.rows[0].status_pagamento !== 'pendente' ||
            pedido.rows[0].idpreferencia ||
            pedido.rows[0].idorder
        ) {
            throw criarErro(
                'Só é possível remover produtos antes de iniciar o checkout e com pagamento pendente.',
                409
            );
        }

        const item = await client.query(
            `SELECT quantidade_reservada
             FROM produto_pedido
             WHERE idpedido = $1 AND idproduto = $2
             FOR UPDATE`,
            [pedidoId, produtoId]
        );
        if (!item.rows[0]) {
            throw criarErro('Produto não encontrado neste pedido.', 404);
        }

        await client.query(
            `UPDATE produto
             SET quantidade = quantidade + $1
             WHERE idproduto = $2`,
            [item.rows[0].quantidade_reservada, produtoId]
        );
        await client.query(
            `DELETE FROM produto_pedido
             WHERE idpedido = $1 AND idproduto = $2`,
            [pedidoId, produtoId]
        );

        const total = await client.query(
            `SELECT COALESCE(SUM(quantidade * preco_unitario), 0) AS valor_total,
                    COUNT(*) AS quantidade_itens
             FROM produto_pedido
             WHERE idpedido = $1`,
            [pedidoId]
        );
        const pedidoCancelado = Number(total.rows[0].quantidade_itens) === 0;
        if (pedidoCancelado) {
            await client.query(
                `UPDATE pedido SET status = 'cancelado' WHERE idpedido = $1`,
                [pedidoId]
            );
            await client.query(
                `UPDATE pagamento
                 SET status = 'cancelado'
                 WHERE idpedido = $1 AND status = 'pendente'`,
                [pedidoId]
            );
        } else {
            await client.query(
                `UPDATE pedido
                 SET valor_total = $1
                 WHERE idpedido = $2`,
                [total.rows[0].valor_total, pedidoId]
            );
            await client.query(
                `UPDATE pagamento
                 SET valor = $1
                 WHERE idpedido = $2 AND status = 'pendente'`,
                [total.rows[0].valor_total, pedidoId]
            );
        }

        await client.query('COMMIT');
        return {
            pedidoId: String(pedidoId),
            produtoId: String(produtoId),
            quantidadeRemovida: item.rows[0].quantidade,
            pedidoCancelado,
        };
    } catch (error) {
        await rollback(client);
        throw error;
    } finally {
        client.release();
    }
}

function montarItem(item) {
    return {
        id: `${item.idpedido}-${item.idproduto}`,
        pedidoId: String(item.idpedido),
        produtoId: String(item.idproduto),
        quantidade: item.quantidade,
        precoUnitario: Number(item.preco_unitario),
        produtoNome: item.nome,
    };
}

async function listarItensPedido(pedidoId, usuarioAutenticado) {
    const id = await verificarAcessoPedido(pedidoId, usuarioAutenticado);
    const resultado = await pool.query(
        `SELECT pp.idpedido, pp.idproduto, pp.quantidade,
                pp.preco_unitario, p.nome
         FROM produto_pedido pp
         JOIN produto p ON p.idproduto = pp.idproduto
         WHERE pp.idpedido = $1
         ORDER BY pp.idproduto`,
        [id]
    );

    return resultado.rows.map(montarItem);
}

function montarVenda(row) {
    return {
        id: String(row.idpedido),
        pedidoId: String(row.idpedido),
        cliente: row.nome_usuario,
        data: row.data,
        formaPagamento: row.forma_pagamento,
        valorTotal: Number(row.valor_total),
        statusPedido: statusSaida[row.status] || row.status,
        itens: row.itens,
    };
}

const consultaVendas = `
    SELECT p.idpedido, p.data, p.valor_total, p.status,
           u.nome AS nome_usuario,
           pg.forma_pagamento,
           json_agg(
               json_build_object(
                   'produtoId', pp.idproduto,
                   'nome', produto.nome,
                   'quantidade', pp.quantidade,
                   'precoUnitario', pp.preco_unitario
               )
               ORDER BY pp.idproduto
           ) AS itens
    FROM pedido p
    JOIN usuario u ON u.idusuario = p.idusuario
    JOIN produto_pedido pp ON pp.idpedido = p.idpedido
    JOIN produto ON produto.idproduto = pp.idproduto
    JOIN LATERAL (
        SELECT forma_pagamento, status, provedor
        FROM pagamento
        WHERE idpedido = p.idpedido
        ORDER BY idpagamento DESC
        LIMIT 1
    ) pg ON TRUE
    WHERE pg.status = 'aprovado'
      AND pg.provedor = 'mercado_pago'
    GROUP BY p.idpedido, p.data, p.valor_total, p.status,
             u.nome, pg.forma_pagamento
`;

async function listarVendas() {
    const resultado = await pool.query(
        `${consultaVendas} ORDER BY p.data DESC, p.idpedido DESC`
    );
    return resultado.rows.map(montarVenda);
}

module.exports = {
    criarPedido,
    buscarPedidoPorId,
    listarPedidos,
    atualizarPedido,
    criarItemPedido,
    removerItemPedido,
    listarItensPedido,
    listarVendas,
};
