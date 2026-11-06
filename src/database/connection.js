
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
        const resultado = await pool.query('SELECT NOW()');

        console.log('Conexão com PostgreSQL estabelecida!');
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
