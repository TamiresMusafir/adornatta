
const { Pool } = require('pg');

const roleAplicacao = process.env.DB_ROLE || 'adornatta_app';
if (roleAplicacao !== 'adornatta_app') {
    throw new Error('DB_ROLE deve ser adornatta_app para o backend.');
}

const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    options: '-c role=adornatta_app',
});

// Identifica erros em conexões que estão ociosas no pool
pool.on('error', (err) => {
    console.error('Erro inesperado no pool do PostgreSQL:', err);
});

// Testa a conexão com o banco
async function testarConexao() {
    try {
        const resultado = await pool.query(
            `SELECT NOW() AS now, current_user AS role,
                    session_user AS login,
                    (SELECT rolsuper FROM pg_roles
                     WHERE rolname = session_user) AS login_superuser`
        );
        const { role, login, login_superuser: loginSuperuser } =
            resultado.rows[0];
        if (role !== 'adornatta_app') {
            throw new Error(
                'A conexão do backend não assumiu a role adornatta_app.'
            );
        }
        if (loginSuperuser) {
            throw new Error(
                `O login PostgreSQL "${login}" é superusuário; configure um login próprio e restrito em DB_USER.`
            );
        }

        console.log('Conexão com PostgreSQL estabelecida!');
        console.log('Login PostgreSQL:', login);
        console.log('Role ativa:', role);
        console.log('Horário do banco:', resultado.rows[0].now);

    } catch (error) {
        console.error('Erro ao conectar com PostgreSQL:', error);
        throw error;
    }
}

module.exports = {
    pool,
    testarConexao,
};
