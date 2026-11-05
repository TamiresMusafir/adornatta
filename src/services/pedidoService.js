const { pool } = require('../database/connection');

const statusEntrada = {
    'Em análise': 'pendente',
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
    confirmado: 'Em análise',
    em_preparacao: 'Em preparação',
    enviado: 'Enviado',
    entregue: 'Entregue',
    cancelado: 'Cancelado',
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
        cep: dados.cep.replace(/\D/g, ''),
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
        !/^[0-9]{8}$/.test(endereco.cep)
    ) {
        throw criarErro('Endereço de entrega inválido.');
    }

    return endereco;
}

async function obterEndereco(client, idusuario, dadosEndereco) {
    if (dadosEndereco) {
        return validarEndereco(dadosEndereco);
    }

    const resultado = await client.query(
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
        enderecoEntrega: endereco,
    };
}

const consultaPedidos = `
    SELECT p.idpedido, p.data, p.valor_total, p.status, p.idusuario,
           p.logradouro_entrega, p.numero_entrega, p.complemento_entrega,
           p.bairro_entrega, p.cidade_entrega, p.uf_entrega, p.cep_entrega,
           pg.forma_pagamento, fp.bandeira, fp.idformapagamento
    FROM pedido p
    LEFT JOIN LATERAL (
        SELECT idformapagamento, forma_pagamento
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
    const total = dados.valorTotal;
    if (
        typeof total !== 'number' ||
        !Number.isFinite(total) ||
        total < 0 ||
        total > 99999999.99
    ) {
        throw criarErro('Valor total do pedido inválido.');
    }

    const status = dados.status === undefined
        ? 'pendente'
        : statusEntrada[dados.status];
    if (!status || !['pendente', 'confirmado'].includes(status)) {
        throw criarErro('O pedido deve iniciar em análise ou confirmado.');
    }
    const data = validarData(dados.data);

    const client = await pool.connect();
    let pedidoId;
    try {
        await client.query('BEGIN');
        await validarUsuario(client, idusuario);
        const endereco = await obterEndereco(client, idusuario, enderecoInformado);

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
                status,
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
    if (!status) {
        throw criarErro('Status do pedido inválido.');
    }

    const resultado = await pool.query(
        `UPDATE pedido
         SET status = $1
         WHERE idpedido = $2
         RETURNING idpedido`,
        [status, pedidoId]
    );

    return resultado.rowCount > 0
        ? await buscarPedidoPorId(pedidoId)
        : null;
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
        const produto = await client.query(
            `SELECT preco_unitario
             FROM produto
             WHERE idproduto = $1`,
            [produtoId]
        );
        if (!produto.rows[0]) {
            throw criarErro('Produto não encontrado.', 404);
        }

        await client.query(
            `INSERT INTO produto_pedido
                (idproduto, idpedido, quantidade, preco_unitario)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (idproduto, idpedido)
             DO UPDATE SET
                quantidade = produto_pedido.quantidade + EXCLUDED.quantidade,
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

async function criarVendaComoPedido(dados) {
    if (!dados || typeof dados !== 'object' || Array.isArray(dados)) {
        throw criarErro('Dados da venda inválidos.');
    }

    const idusuario = validarId(dados.usuarioId, 'Usuário');
    const produtoId = validarId(dados.produtoId, 'Produto');
    const quantidade = dados.quantidade;
    if (!Number.isSafeInteger(quantidade) || quantidade < 1) {
        throw criarErro('Quantidade da venda inválida.');
    }

    const formaPagamento = validarPagamento(dados.formaPagamento);
    const data = validarData(dados.data);
    const client = await pool.connect();
    let pedidoId;
    try {
        await client.query('BEGIN');
        await validarUsuario(client, idusuario);
        const endereco = await obterEndereco(
            client,
            idusuario,
            dados.enderecoEntrega || dados.endereco
        );
        const produto = await client.query(
            `SELECT nome, preco_unitario
             FROM produto
             WHERE idproduto = $1 AND quantidade >= $2
             FOR UPDATE`,
            [produtoId, quantidade]
        );
        if (!produto.rows[0]) {
            const existe = await client.query(
                'SELECT idproduto FROM produto WHERE idproduto = $1',
                [produtoId]
            );
            if (!existe.rows[0]) {
                throw criarErro('Produto não encontrado.', 404);
            }
            throw criarErro('Estoque insuficiente.', 409);
        }

        const unitario = Number(produto.rows[0].preco_unitario);
        const total = unitario * quantidade;
        if (!Number.isFinite(total) || total > 99999999.99) {
            throw criarErro('Valor total da venda inválido.');
        }

        const pedido = await client.query(
            `INSERT INTO pedido
                (data, valor_total, status, idusuario, logradouro_entrega,
                 numero_entrega, complemento_entrega, bairro_entrega,
                 cidade_entrega, uf_entrega, cep_entrega)
             VALUES (COALESCE($1::timestamptz, CURRENT_TIMESTAMP), $2,
                     'entregue', $3, $4, $5, $6, $7, $8, $9, $10)
             RETURNING idpedido`,
            [
                data,
                total,
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
        pedidoId = pedido.rows[0].idpedido;

        await client.query(
            `INSERT INTO produto_pedido
                (idproduto, idpedido, quantidade, preco_unitario)
             VALUES ($1, $2, $3, $4)`,
            [produtoId, pedidoId, quantidade, unitario]
        );
        const estoque = await client.query(
            `UPDATE produto
             SET quantidade = quantidade - $1
             WHERE idproduto = $2 AND quantidade >= $1
             RETURNING idproduto`,
            [quantidade, produtoId]
        );
        if (!estoque.rows[0]) {
            throw criarErro('Estoque insuficiente.', 409);
        }

        await client.query(
            `INSERT INTO pagamento
                (idpedido, valor, status, forma_pagamento, provedor,
                 data_pagamento)
             VALUES ($1, $2, 'aprovado', $3, 'manual', CURRENT_TIMESTAMP)`,
            [pedidoId, total, formaPagamento]
        );
        await client.query('COMMIT');
    } catch (error) {
        await rollback(client);
        throw error;
    } finally {
        client.release();
    }

    return buscarVendaPorPedido(pedidoId);
}

function montarVenda(row) {
    return {
        id: `${row.idpedido}-${row.idproduto}`,
        cliente: row.nome_usuario,
        data: row.data,
        produtoId: String(row.idproduto),
        quantidade: row.quantidade,
        formaPagamento: row.forma_pagamento,
        valorUnitario: Number(row.preco_unitario),
        valorTotal: Number(row.valor_total),
    };
}

const consultaVendas = `
    SELECT p.idpedido, p.data, p.valor_total, u.nome AS nome_usuario,
           pp.idproduto, pp.quantidade, pp.preco_unitario,
           pg.forma_pagamento
    FROM pedido p
    JOIN usuario u ON u.idusuario = p.idusuario
    JOIN produto_pedido pp ON pp.idpedido = p.idpedido
    LEFT JOIN LATERAL (
        SELECT forma_pagamento
        FROM pagamento
        WHERE idpedido = p.idpedido
        ORDER BY idpagamento DESC
        LIMIT 1
    ) pg ON TRUE
    WHERE p.status = 'entregue'
`;

async function buscarVendaPorPedido(pedidoId) {
    const resultado = await pool.query(
        `${consultaVendas} AND p.idpedido = $1 ORDER BY pp.idproduto`,
        [pedidoId]
    );
    return resultado.rows.map(montarVenda);
}

async function listarVendas() {
    const resultado = await pool.query(
        `${consultaVendas} ORDER BY p.data DESC, p.idpedido DESC, pp.idproduto`
    );
    return resultado.rows.map(montarVenda);
}

module.exports = {
    criarPedido,
    buscarPedidoPorId,
    listarPedidos,
    atualizarPedido,
    criarItemPedido,
    listarItensPedido,
    criarVendaComoPedido,
    listarVendas,
};
