require('dotenv').config();

const fs = require('node:fs');
const path = require('node:path');

const { pool, testarConexao } = require('../src/database/connection');

const resultados = [];

function registrar(nome, passou, detalhe = '') {
    resultados.push({ nome, passou, detalhe });
    console.log(`${passou ? 'PASS' : 'FAIL'} ${nome}${detalhe ? ` - ${detalhe}` : ''}`);
}

async function main() {
    if (process.env.DB_ROLE !== 'adornatta_app') {
        registrar(
            'DB_ROLE restringe o backend',
            false,
            'DB_ROLE deve ser exatamente "adornatta_app"'
        );
    } else {
        registrar('DB_ROLE restringe o backend', true);
    }

    if (
        process.env.DB_MIGRATION_USER &&
        process.env.DB_MIGRATION_USER === process.env.DB_USER
    ) {
        registrar(
            'Contas de aplicação e migração são separadas',
            false,
            'DB_MIGRATION_USER não pode ser igual a DB_USER'
        );
    } else if (!process.env.DB_MIGRATION_USER) {
        registrar(
            'Contas de aplicação e migração são separadas',
            false,
            'DB_MIGRATION_USER não está configurada'
        );
    } else {
        registrar('Contas de aplicação e migração são separadas', true);
    }

    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
        registrar(
            'JWT_SECRET possui tamanho seguro',
            false,
            'configure uma chave aleatória com pelo menos 32 caracteres'
        );
    } else {
        registrar('JWT_SECRET possui tamanho seguro', true);
    }

    try {
        await testarConexao();
        const resultado = await pool.query(
            `SELECT current_user AS role,
                    session_user AS login,
                    (SELECT rolsuper FROM pg_roles WHERE rolname = session_user) AS login_superuser`
        );
        const { role, login, login_superuser: loginSuperuser } = resultado.rows[0];

        registrar(
            'Banco assume a role adornatta_app',
            role === 'adornatta_app',
            `role=${role}, login=${login}`
        );
        registrar(
            'Login do banco não é superusuário',
            loginSuperuser !== true,
            `login=${login}`
        );

        const catalogo = await pool.query(
            `SELECT COUNT(*)::integer AS total
             FROM pg_catalog.pg_tables
             WHERE schemaname = 'public'`
        );
        registrar(
            'Conexão pode consultar o catálogo público',
            catalogo.rows[0].total >= 1,
            `${catalogo.rows[0].total} tabelas encontradas`
        );
    } catch (erro) {
        registrar('Conexão segura com PostgreSQL', false, erro.message);
    }

    const migrationPath = path.join(
        __dirname,
        '..',
        'src',
        'database',
        'migrations',
        '001_app_role_privileges.sql'
    );
    const migration = fs.readFileSync(migrationPath, 'utf8');
    registrar(
        'Migration revoga privilégios públicos',
        /REVOKE ALL ON SCHEMA public FROM PUBLIC/i.test(migration),
        '001_app_role_privileges.sql'
    );
    registrar(
        'Migration restringe tabelas públicas',
        /REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC, adornatta_app/i.test(migration),
        '001_app_role_privileges.sql'
    );

    await pool.end();

    const falhas = resultados.filter((resultado) => !resultado.passou);
    console.log(`\nResultado: ${resultados.length - falhas.length}/${resultados.length} verificações passaram.`);
    if (falhas.length > 0) {
        process.exitCode = 1;
    }
}

main().catch((erro) => {
    console.error('FALHA AO EXECUTAR TESTE DE SEGURANÇA:', erro.message);
    process.exitCode = 1;
});
