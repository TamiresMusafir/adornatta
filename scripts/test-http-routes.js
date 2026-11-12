require('dotenv').config();

const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const { pool } = require('../src/database/connection');

async function main() {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET deve estar configurada para testar as rotas.');
    }

    let server;
    try {
        const identity = await pool.query(
            `SELECT current_user AS role, session_user AS login,
                    r.rolsuper AS login_is_superuser
             FROM pg_roles r
             WHERE r.rolname = session_user`
        );
        assert.equal(identity.rows[0]?.role, 'adornatta_app');
        assert.notEqual(identity.rows[0]?.login, 'adornatta_app');
        assert.equal(identity.rows[0]?.login_is_superuser, false);

        server = app.listen(0, '127.0.0.1');
        await new Promise((resolve, reject) => {
            server.once('listening', resolve);
            server.once('error', reject);
        });

        const address = server.address();
        const baseUrl = `http://127.0.0.1:${address.port}`;
        const requisitar = (rota, options) => fetch(`${baseUrl}${rota}`, options);

        const health = await requisitar('/api/health');
        assert.equal(health.status, 200);
        assert.equal((await health.json()).status, 'ok');

        for (const rota of ['/api/categorias', '/api/produtos']) {
            const resposta = await requisitar(rota);
            assert.equal(resposta.status, 200, `${rota} deve responder sob adornatta_app`);
            assert.ok(Array.isArray(await resposta.json()));
        }

        for (const rota of [
            '/api/usuarios',
            '/api/pedidos',
            '/api/itensPedido',
            '/api/formasPagamento',
        ]) {
            const resposta = await requisitar(rota);
            assert.equal(resposta.status, 401, `${rota} deve exigir autenticação`);
        }

        const tokenCliente = jwt.sign(
            { perfil: 'cliente' },
            process.env.JWT_SECRET,
            { subject: '1', algorithm: 'HS256' }
        );
        const tokenAdministrador = jwt.sign(
            { perfil: 'administrador' },
            process.env.JWT_SECRET,
            { subject: '1', algorithm: 'HS256' }
        );
        const pedidosAdmin = await requisitar('/api/pedidos', {
            headers: { Cookie: `token=${tokenAdministrador}` },
        });
        assert.equal(pedidosAdmin.status, 200);
        assert.ok(Array.isArray(await pedidosAdmin.json()));

        const tentativaAdmin = await requisitar('/api/produtos', {
            method: 'POST',
            headers: {
                Cookie: `token=${tokenCliente}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome: 'Não deve ser criado' }),
        });
        assert.equal(tentativaAdmin.status, 403);

        const webhookIgnorado = await requisitar(
            '/api/pagamentos/mercado-pago/webhook?type=merchant_order&id=1',
            { method: 'POST' }
        );
        assert.equal(webhookIgnorado.status, 200);
        assert.equal((await webhookIgnorado.json()).ignorado, true);

        if (process.env.MERCADO_PAGO_WEBHOOK_SECRET) {
            const webhookInvalido = await requisitar(
                '/api/pagamentos/mercado-pago/webhook?type=payment&id=1',
                { method: 'POST' }
            );
            assert.equal(webhookInvalido.status, 401);
        }

        const validacaoWebhook =
            process.env.MERCADO_PAGO_WEBHOOK_SECRET
                ? 'assinaturas inválidas são recusadas'
                : 'webhook de pagamento inválido não testado (segredo não configurado)';
        console.log(
            `PASS: rotas HTTP essenciais respondem com login distinto e role adornatta_app; autenticação e autorização são verificadas; ${validacaoWebhook}.`
        );
    } finally {
        if (server) {
            await new Promise((resolve, reject) => {
                server.close((error) => error ? reject(error) : resolve());
            });
        }
        await pool.end();
    }
}

main().catch((error) => {
    console.error('Falha nos testes HTTP:', error.stack || error.message);
    process.exitCode = 1;
});
