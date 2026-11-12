const mercadoPagoService = require('../services/mercadoPagoService');

async function criarCheckout(req, res, next) {
    try {
        const resultado = await mercadoPagoService.criarCheckout(
            req.params.id,
            req.usuarioAutenticado
        );
        return res.status(200).json(resultado);
    } catch (error) {
        return next(error);
    }
}

async function receberWebhook(req, res, next) {
    try {
        const tipo = req.body?.type || req.body?.topic ||
            req.query.type || req.query.topic;
        if (!['payment', 'orders', 'order'].includes(tipo)) {
            return res.status(200).json({ recebido: true, ignorado: true });
        }

        const resourceId = req.body?.data?.id || req.query['data.id'] ||
            req.query.id;
        const requestId = req.get('x-request-id');
        const assinatura = req.get('x-signature');
        const valida = mercadoPagoService.validarAssinaturaWebhook({
            assinatura,
            requestId,
            resourceId: resourceId ? String(resourceId) : '',
            secret: mercadoPagoService.obterSegredoWebhook(),
        });
        if (!valida) {
            return res.status(401).json({
                status: 'error',
                message: 'Assinatura do webhook inválida.',
            });
        }

        const resultado = tipo === 'payment'
            ? await mercadoPagoService.processarNotificacaoPagamento(resourceId)
            : await mercadoPagoService.processarNotificacaoOrder(resourceId);
        return res.status(200).json({ recebido: true, ...resultado });
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    criarCheckout,
    receberWebhook,
};
