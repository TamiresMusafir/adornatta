const { pool } = require('../database/connection');

function criarErro(mensagem, statusCode = 400) {
    const erro = new Error(mensagem);
    erro.statusCode = statusCode;
    return erro;
}

function validarId(id, nome = 'identificador') {
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

function validarProduto(dados) {
    if (!dados || typeof dados !== 'object' || Array.isArray(dados)) {
        throw criarErro('Dados do produto inválidos.');
    }

    const {
        nome,
        descricao,
        preco,
        material,
        tipoBanho,
        quantidadeDisponivel,
        imagem,
        categoriaId,
    } = dados;

    if (
        typeof nome !== 'string' ||
        !nome.trim() ||
        nome.trim().length > 80
    ) {
        throw criarErro('Nome inválido ou maior que 80 caracteres.');
    }

    if (typeof descricao !== 'string' || descricao.trim().length < 5) {
        throw criarErro('Informe uma descrição válida.');
    }

    const precoNumerico = preco;
    if (
        typeof precoNumerico !== 'number' ||
        !Number.isFinite(precoNumerico) ||
        precoNumerico <= 0 ||
        precoNumerico > 99999999.99
    ) {
        throw criarErro('Preço inválido.');
    }

    if (
        typeof material !== 'string' ||
        material.trim().length < 2 ||
        material.length > 40
    ) {
        throw criarErro('Material inválido ou maior que 40 caracteres.');
    }

    if (
        typeof tipoBanho !== 'string' ||
        tipoBanho.trim().length < 2 ||
        tipoBanho.length > 40
    ) {
        throw criarErro('Tipo de banho inválido ou maior que 40 caracteres.');
    }

    const quantidade = quantidadeDisponivel;
    if (!Number.isSafeInteger(quantidade) || quantidade < 0) {
        throw criarErro('Quantidade disponível inválida.');
    }

    const categoria = validarId(categoriaId, 'Categoria');

    if (typeof imagem !== 'string' || !imagem.trim()) {
        throw criarErro('Imagem do produto é obrigatória.');
    }

    return {
        nome: nome.trim(),
        descricao: descricao.trim(),
        preco: precoNumerico,
        material: material.trim(),
        tipoBanho: tipoBanho.trim(),
        quantidade,
        imagem: imagem.trim(),
        categoriaId: categoria,
    };
}

function formatarProduto(linha) {
    return {
        id: String(linha.idproduto),
        nome: linha.nome,
        descricao: linha.descricao,
        preco: Number(linha.preco_unitario),
        material: linha.material,
        tipoBanho: linha.tipo_banho,
        quantidadeDisponivel: linha.quantidade,
        imagem: linha.imagem,
        categoriaId: linha.idcategoria,
    };
}

const consultaProduto = `
    SELECT p.idproduto, p.nome, p.descricao, p.preco_unitario,
           p.material, p.tipo_banho, p.quantidade, p.idcategoria,
           (
               SELECT ip.url
               FROM imagem_produto ip
               WHERE ip.idproduto = p.idproduto
               ORDER BY ip.url
               LIMIT 1
           ) AS imagem
    FROM produto p
`;

async function listarCategorias() {
    const resultado = await pool.query(
        'SELECT idcategoria, nome FROM categoria ORDER BY nome'
    );

    return resultado.rows.map((categoria) => ({
        id: String(categoria.idcategoria),
        nome: categoria.nome,
    }));
}

async function listarProdutos() {
    const resultado = await pool.query(
        `${consultaProduto} ORDER BY p.idproduto`
    );

    return resultado.rows.map(formatarProduto);
}

async function buscarProdutoPorId(id) {
    const produtoId = validarId(id, 'Produto');
    const resultado = await pool.query(
        `${consultaProduto} WHERE p.idproduto = $1`,
        [produtoId]
    );

    return resultado.rows[0] ? formatarProduto(resultado.rows[0]) : null;
}

async function salvarImagem(client, produtoId, imagem) {
    await client.query(
        'DELETE FROM imagem_produto WHERE idproduto = $1 AND url <> $2',
        [produtoId, imagem]
    );
    await client.query(
        `INSERT INTO imagem_produto (idproduto, url)
         VALUES ($1, $2)
         ON CONFLICT (idproduto, url) DO NOTHING`,
        [produtoId, imagem]
    );
}

async function rollback(client) {
    try {
        await client.query('ROLLBACK');
    } catch (error) {
        console.error('Erro ao desfazer transação do catálogo:', error);
    }
}

async function criarProduto(dados) {
    const produto = validarProduto(dados);
    const client = await pool.connect();
    let id;

    try {
        await client.query('BEGIN');
        const resultado = await client.query(
            `INSERT INTO produto
                (nome, descricao, preco_unitario, material,
                 tipo_banho, quantidade, idcategoria)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING idproduto`,
            [
                produto.nome,
                produto.descricao,
                produto.preco,
                produto.material,
                produto.tipoBanho,
                produto.quantidade,
                produto.categoriaId,
            ]
        );
        id = resultado.rows[0].idproduto;
        await salvarImagem(client, id, produto.imagem);
        await client.query('COMMIT');
    } catch (error) {
        await rollback(client);

        if (error.code === '23503') {
            throw criarErro('Categoria não encontrada.', 404);
        }

        throw error;
    } finally {
        client.release();
    }

    return buscarProdutoPorId(id);
}

async function atualizarProduto(id, dados) {
    const produtoId = validarId(id, 'Produto');
    if (!dados || typeof dados !== 'object' || Array.isArray(dados)) {
        throw criarErro('Dados do produto inválidos.');
    }

    const atual = await buscarProdutoPorId(produtoId);
    if (!atual) {
        return null;
    }

    const produto = validarProduto({ ...atual, ...dados });
    const client = await pool.connect();

    try {
        await client.query('BEGIN');
        await client.query(
            `UPDATE produto
             SET nome = $1, descricao = $2, preco_unitario = $3,
                 material = $4, tipo_banho = $5, quantidade = $6,
                 idcategoria = $7
             WHERE idproduto = $8`,
            [
                produto.nome,
                produto.descricao,
                produto.preco,
                produto.material,
                produto.tipoBanho,
                produto.quantidade,
                produto.categoriaId,
                produtoId,
            ]
        );
        await salvarImagem(client, produtoId, produto.imagem);
        await client.query('COMMIT');
    } catch (error) {
        await rollback(client);

        if (error.code === '23503') {
            throw criarErro('Categoria não encontrada.', 404);
        }

        throw error;
    } finally {
        client.release();
    }

    return buscarProdutoPorId(produtoId);
}

async function excluirProduto(id) {
    const produtoId = validarId(id, 'Produto');
    let resultado;
    try {
        resultado = await pool.query(
            'DELETE FROM produto WHERE idproduto = $1 RETURNING idproduto',
            [produtoId]
        );
    } catch (error) {
        if (error.code === '23503') {
            throw criarErro(
                'Não é possível excluir um produto que já pertence a um pedido.',
                409
            );
        }
        throw error;
    }

    return resultado.rowCount > 0;
}

module.exports = {
    listarCategorias,
    listarProdutos,
    buscarProdutoPorId,
    criarProduto,
    atualizarProduto,
    excluirProduto,
};
