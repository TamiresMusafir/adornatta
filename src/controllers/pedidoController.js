const pedidoService = require('../services/pedidoService');

async function criarPedido(req, res, next) {
    try {
        const pedido = await pedidoService.criarPedido(
            req.body,
            req.usuarioAutenticado
        );
        return res.status(201).json(pedido);
    } catch (error) {
        return next(error);
    }
}

async function buscarPedido(req, res, next) {
    try {
        const pedido = await pedidoService.buscarPedidoPorId(
            req.params.id,
            req.usuarioAutenticado
        );
        if (!pedido) {
            return res.status(404).json({
                status: 'error',
                message: 'Pedido não encontrado.',
            });
        }

        return res.status(200).json(pedido);
    } catch (error) {
        return next(error);
    }
}

async function listarPedidos(req, res, next) {
    try {
        const pedidos = await pedidoService.listarPedidos(
            req.usuarioAutenticado,
            req.query.usuarioId
        );
        return res.status(200).json(pedidos);
    } catch (error) {
        return next(error);
    }
}

async function atualizarPedido(req, res, next) {
    try {
        const pedido = await pedidoService.atualizarPedido(
            req.params.id,
            req.body
        );
        if (!pedido) {
            return res.status(404).json({
                status: 'error',
                message: 'Pedido não encontrado.',
            });
        }

        return res.status(200).json(pedido);
    } catch (error) {
        return next(error);
    }
}

async function criarItemPedido(req, res, next) {
    try {
        const item = await pedidoService.criarItemPedido(
            req.body,
            req.usuarioAutenticado
        );
        return res.status(201).json(item);
    } catch (error) {
        return next(error);
    }
}

async function listarItensPedido(req, res, next) {
    try {
        const itens = await pedidoService.listarItensPedido(
            req.query.pedidoId,
            req.usuarioAutenticado
        );
        return res.status(200).json(itens);
    } catch (error) {
        return next(error);
    }
}

async function listarVendas(req, res, next) {
    try {
        return res.status(200).json(await pedidoService.listarVendas());
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    criarPedido,
    buscarPedido,
    listarPedidos,
    atualizarPedido,
    criarItemPedido,
    listarItensPedido,
    listarVendas,
};
