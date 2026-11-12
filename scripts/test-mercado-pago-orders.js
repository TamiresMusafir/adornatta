require('dotenv').config();

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const mercadoPagoService = require('../src/services/mercadoPagoService');
const { pool } = require('../src/database/connection');

async function main() {
    try {
        const configuracaoAnterior = {
            token: process.env.MERCADO_PAGO_ACCESS_TOKEN,
            segredo: process.env.MERCADO_PAGO_WEBHOOK_SECRET,
            webhookUrl: process.env.MERCADO_PAGO_WEBHOOK_URL,
            frontend: process.env.FRONTEND_URL,
        };
        process.env.MERCADO_PAGO_ACCESS_TOKEN = 'TEST-token-for-unit-test';
        process.env.MERCADO_PAGO_WEBHOOK_SECRET = '';
        process.env.MERCADO_PAGO_WEBHOOK_URL = '';
        process.env.FRONTEND_URL = 'http://localhost:5173';
        assert.doesNotThrow(() => mercadoPagoService.validarConfiguracao());
        assert.throws(
            () => mercadoPagoService.obterSegredoWebhook(),
            (error) => error.statusCode === 503
        );
        if (configuracaoAnterior.token === undefined) {
            delete process.env.MERCADO_PAGO_ACCESS_TOKEN;
        } else {
            process.env.MERCADO_PAGO_ACCESS_TOKEN = configuracaoAnterior.token;
        }
        if (configuracaoAnterior.segredo === undefined) {
            delete process.env.MERCADO_PAGO_WEBHOOK_SECRET;
        } else {
            process.env.MERCADO_PAGO_WEBHOOK_SECRET = configuracaoAnterior.segredo;
        }
        if (configuracaoAnterior.webhookUrl === undefined) {
            delete process.env.MERCADO_PAGO_WEBHOOK_URL;
        } else {
            process.env.MERCADO_PAGO_WEBHOOK_URL = configuracaoAnterior.webhookUrl;
        }
        if (configuracaoAnterior.frontend === undefined) {
            delete process.env.FRONTEND_URL;
        } else {
            process.env.FRONTEND_URL = configuracaoAnterior.frontend;
        }

        assert.equal(
            mercadoPagoService.converterStatusOrder('processed'),
            'aprovado'
        );
        assert.equal(
            mercadoPagoService.converterStatusOrder('failed'),
            'recusado'
        );
        assert.equal(
            mercadoPagoService.converterStatusOrder('canceled'),
            'cancelado'
        );
        assert.equal(
            mercadoPagoService.converterStatusOrder('refunded'),
            'estornado'
        );
        for (const status of ['created', 'action_required', 'processing']) {
            assert.equal(
                mercadoPagoService.converterStatusOrder(status),
                'pendente'
            );
        }
        assert.equal(
            mercadoPagoService.converterStatusOrder('unknown'),
            null
        );
        assert.equal(mercadoPagoService.CHECKOUT_TIMEOUT_MINUTES, 15);

        const frontendUrl = new URL('https://loja.example.test/base/');
        const payload = mercadoPagoService.criarPayloadOrder(
            { idpedido: 12, idpagamento: 34, email: 'cliente@example.test' },
            [
                { nome: 'Anel', quantidade: 2, preco_unitario: '19.90' },
                { nome: 'Brinco', quantidade: 1, preco_unitario: '10.20' },
            ],
            5000,
            frontendUrl
        );
        assert.deepEqual(
            {
                type: payload.type,
                processing_mode: payload.processing_mode,
                capture_mode: payload.capture_mode,
                total_amount: payload.total_amount,
                external_reference: payload.external_reference,
            },
            {
                type: 'online',
                processing_mode: 'manual',
                capture_mode: 'automatic_async',
                total_amount: '50.00',
                external_reference: '34',
            }
        );
        assert.deepEqual(payload.items, [
            { title: 'Anel', quantity: 2, unit_price: '19.90' },
            { title: 'Brinco', quantity: 1, unit_price: '10.20' },
        ]);
        assert.equal(payload.payer.email, 'cliente@example.test');
        assert.equal(
            payload.config.online.success_url,
            'https://loja.example.test/pagamento/retorno?pedidoId=12&resultado=approved'
        );
        assert.equal(payload.config.online.auto_return, 'approved');

        const resourceId = 'ORDTST01KS5AJ6HTK2HRQ3XJ3C2JCKP9';
        const requestId = 'request-123';
        const timestamp = '1730000000000';
        const secret = 'webhook-secret-for-test';
        const manifest =
            `id:${resourceId.toLowerCase()};request-id:${requestId};ts:${timestamp};`;
        const signature = crypto
            .createHmac('sha256', secret)
            .update(manifest)
            .digest('hex');
        const valid = mercadoPagoService.validarAssinaturaWebhook({
            assinatura: `ts=${timestamp},v1=${signature}`,
            requestId,
            resourceId,
            secret,
        });
        assert.equal(valid, true);
        assert.equal(
            mercadoPagoService.validarAssinaturaWebhook({
                assinatura: `ts=${timestamp},v1=${signature}`,
                requestId,
                resourceId: 'ORDTSTdifferent',
                secret,
            }),
            false
        );

        console.log(
            'PASS: Order sem segredo de webhook, payload, transições de status e assinatura.'
        );
    } finally {
        await pool.end();
    }
}

main().catch((error) => {
    console.error(
        'Falha nos testes de Mercado Pago Orders:',
        error.stack || error.message
    );
    process.exitCode = 1;
});
