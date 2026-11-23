const formaPagamentoService = require('../services/formaPagamentoService');

async function listar(req, res, next) {
    try {
        const formas = await formaPagamentoService.listarFormasPagamento(
            req.usuarioAutenticado,
            req.query.usuarioId
        );
        return res.status(200).json(formas);
    } catch (error) {
        return next(error);
    }
}

async function criar(req, res, next) {
    try {
        const forma = await formaPagamentoService.criarFormaPagamento(
            req.body,
            req.usuarioAutenticado
        );
        return res.status(201).json(forma);
    } catch (error) {
        return next(error);
    }
}

async function atualizar(req, res, next) {
    try {
        const forma = await formaPagamentoService.atualizarFormaPagamento(
            req.params.id,
            req.body,
            req.usuarioAutenticado
        );
        if (!forma) {
            return res.status(404).json({
                status: 'error',
                message: 'Forma de pagamento não encontrada.',
            });
        }

        return res.status(200).json(forma);
    } catch (error) {
        return next(error);
    }
}

async function excluir(req, res, next) {
    try {
        const excluida = await formaPagamentoService.excluirFormaPagamento(
            req.params.id,
            req.usuarioAutenticado
        );
        if (!excluida) {
            return res.status(404).json({
                status: 'error',
                message: 'Forma de pagamento não encontrada.',
            });
        }

        return res.status(204).send();
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    listar,
    criar,
    atualizar,
    excluir,
};
