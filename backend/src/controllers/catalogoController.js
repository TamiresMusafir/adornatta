const catalogoService = require('../services/catalogoService');

async function listarCategorias(req, res, next) {
    try {
        return res.status(200).json(await catalogoService.listarCategorias());
    } catch (error) {
        return next(error);
    }
}

async function listarProdutos(req, res, next) {
    try {
        return res.status(200).json(await catalogoService.listarProdutos());
    } catch (error) {
        return next(error);
    }
}

async function buscarProduto(req, res, next) {
    try {
        const produto = await catalogoService.buscarProdutoPorId(req.params.id);
        if (!produto) {
            return res.status(404).json({
                status: 'error',
                message: 'Produto não encontrado.',
            });
        }

        return res.status(200).json(produto);
    } catch (error) {
        return next(error);
    }
}

async function criarProduto(req, res, next) {
    try {
        const produto = await catalogoService.criarProduto(req.body);
        return res.status(201).json(produto);
    } catch (error) {
        return next(error);
    }
}

async function atualizarProduto(req, res, next) {
    try {
        const produto = await catalogoService.atualizarProduto(
            req.params.id,
            req.body
        );
        if (!produto) {
            return res.status(404).json({
                status: 'error',
                message: 'Produto não encontrado.',
            });
        }

        return res.status(200).json(produto);
    } catch (error) {
        return next(error);
    }
}

async function excluirProduto(req, res, next) {
    try {
        const excluido = await catalogoService.excluirProduto(req.params.id);
        if (!excluido) {
            return res.status(404).json({
                status: 'error',
                message: 'Produto não encontrado.',
            });
        }

        return res.status(204).send();
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    listarCategorias,
    listarProdutos,
    buscarProduto,
    criarProduto,
    atualizarProduto,
    excluirProduto,
};
