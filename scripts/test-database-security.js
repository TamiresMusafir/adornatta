require('dotenv').config();

const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { Pool } = require('pg');

const rootPath = path.resolve(__dirname, '..');
const schemaPath = path.resolve(rootPath, '..', 'BDadornatta', 'BancoDadosAdornatta.sql');
const testDatabase = `adornatta_security_test_${crypto.randomBytes(5).toString('hex')}`;

function obterCredenciaisMigration() {
    if (
        !process.env.DB_MIGRATION_USER ||
        !process.env.DB_MIGRATION_PASSWORD ||
        process.env.DB_MIGRATION_USER === process.env.DB_USER
    ) {
        throw new Error(
            'Configure DB_MIGRATION_USER e DB_MIGRATION_PASSWORD distintos das credenciais da aplicação.'
        );
    }

    return {
        user: process.env.DB_MIGRATION_USER,
        password: process.env.DB_MIGRATION_PASSWORD,
    };
}

function quoteIdentifier(value) {
    return `"${value.replace(/"/g, '""')}"`;
}

function executarScript(script, env) {
    execFileSync(process.execPath, [path.join(rootPath, 'src', 'database', script)], {
        cwd: rootPath,
        env,
        stdio: 'inherit',
    });
}

async function main() {
    const host = process.env.DB_HOST;
    const db = process.env.DB_NAME;
    if (
        !['localhost', '127.0.0.1', '::1'].includes(String(host).toLowerCase()) ||
        db !== 'adornatta'
    ) {
        throw new Error(
            'O teste requer DB_HOST local e DB_NAME=adornatta; nenhum dado foi alterado.'
        );
    }

    const adminPool = new Pool({
        host,
        port: Number(process.env.DB_PORT),
        database: db,
        ...obterCredenciaisMigration(),
        connectionTimeoutMillis: 5000,
    });
    let databaseCreated = false;
    let appPool;

    try {
        const identity = await adminPool.query(
            'SELECT current_database() AS database, host(inet_server_addr()) AS server'
        );
        assert.equal(identity.rows[0].database, 'adornatta');
        assert.ok(['127.0.0.1', '::1'].includes(identity.rows[0].server));

        await adminPool.query(
            `CREATE DATABASE ${quoteIdentifier(testDatabase)}`
        );
        databaseCreated = true;

        const setupPool = new Pool({
            host,
            port: Number(process.env.DB_PORT),
            database: testDatabase,
            ...obterCredenciaisMigration(),
        });
        try {
            await setupPool.query(fs.readFileSync(schemaPath, 'utf8'));
        } finally {
            await setupPool.end();
        }

        const testEnv = {
            ...process.env,
            DB_NAME: testDatabase,
            DB_ROLE: 'adornatta_app',
        };
        executarScript('migrate.js', testEnv);
        executarScript('migrate.js', testEnv);
        executarScript('seeds/catalog.js', testEnv);
        executarScript('seeds/catalog.js', testEnv);

        process.env.DB_NAME = testDatabase;
        process.env.DB_ROLE = 'adornatta_app';
        const { pool } = require('../src/database/connection');
        const catalogoService = require('../src/services/catalogoService');
        const usuarioService = require('../src/services/usuarioService');
        const pedidoService = require('../src/services/pedidoService');
        appPool = pool;

        const role = await appPool.query('SELECT current_user AS role');
        assert.equal(role.rows[0].role, 'adornatta_app');

        const categorias = await catalogoService.listarCategorias();
        const produtos = await catalogoService.listarProdutos();
        assert.equal(categorias.length, 4);
        assert.equal(produtos.length, 11);
        assert.deepEqual(produtos.map((produto) => produto.id), [
            '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11',
        ]);

        const injection = `Brinco '); DROP TABLE public.produto; --`;
        const produtoCriado = await catalogoService.criarProduto({
            nome: injection,
            descricao: 'Produto para teste de seguranca',
            preco: 9.99,
            material: 'Metal',
            tipoBanho: 'Ouro',
            quantidadeDisponivel: 1,
            imagem: '/test/injection.jpg',
            categoriaId: 1,
        });
        assert.equal(produtoCriado.nome, injection);
        assert.equal((await catalogoService.listarProdutos()).length, 12);
        await catalogoService.excluirProduto(produtoCriado.id);
        assert.equal((await catalogoService.listarProdutos()).length, 11);

        await assert.rejects(
            catalogoService.buscarProdutoPorId('1 OR 1=1'),
            /inválido/
        );
        await assert.rejects(
            usuarioService.buscarUsuarioPorId('1; DROP TABLE usuario'),
            /inválido/
        );
        await assert.rejects(
            pedidoService.listarPedidos(
                { idusuario: 1, perfil: 'administrador' },
                '1 OR 1=1'
            ),
            /inválido/
        );

        const usuario = await usuarioService.cadastrarUsuario({
            nome: `Teste '); SELECT pg_sleep(5); --`,
            cpf: '12345678901',
            email: `sql-test-${crypto.randomUUID()}@example.test`,
            senha: 'senha-segura-123',
            telefones: ['11912345678'],
        });
        assert.equal(usuario.nome, `Teste '); SELECT pg_sleep(5); --`);
        assert.equal(await usuarioService.buscarUsuarioPorId(usuario.id).then(
            (registro) => registro.nome
        ), usuario.nome);
        const deleted = await appPool.query(
            'SELECT public.excluir_dados_usuario($1) AS excluido',
            [Number(usuario.id)]
        );
        assert.equal(deleted.rows[0].excluido, true);

        await assert.rejects(
            appPool.query(
                `INSERT INTO public.usuario (nome, cpf, perfil, email, senha)
                 VALUES ($1, $2, $3, $4, $5)`,
                [
                    'Conta administrativa indevida',
                    '10987654321',
                    'administrador',
                    'admin-test@example.test',
                    '$2b$12$' + 'a'.repeat(53),
                ]
            ),
            (error) => error.code === '42501'
        );

        const tables = await appPool.query(
            `SELECT to_regclass('public.usuario') AS usuario,
                    to_regclass('public.produto') AS produto`
        );
        assert.equal(tables.rows[0].usuario, 'usuario');
        assert.equal(tables.rows[0].produto, 'produto');
        console.log(
            'PASS: migrations/seed idempotentes, role restrita e cargas SQL-like tratadas como dados.'
        );
    } finally {
        if (appPool) {
            await appPool.end();
        }
        await adminPool.end();

        if (databaseCreated) {
            const cleanupPool = new Pool({
                host,
                port: Number(process.env.DB_PORT),
                database: db,
                ...obterCredenciaisMigration(),
            });
            try {
                await cleanupPool.query(
                    `DROP DATABASE ${quoteIdentifier(testDatabase)} WITH (FORCE)`
                );
            } finally {
                await cleanupPool.end();
            }
        }
    }
}

main().catch((error) => {
    console.error('Falha nos testes de segurança do banco:', error.stack || error.message);
    process.exitCode = 1;
});
