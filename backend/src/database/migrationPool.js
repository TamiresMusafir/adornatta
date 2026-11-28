require('dotenv').config();

const { Pool } = require('pg');

if (
    !process.env.DB_MIGRATION_USER ||
    !process.env.DB_MIGRATION_PASSWORD
) {
    throw new Error(
        'DB_MIGRATION_USER e DB_MIGRATION_PASSWORD devem ser configurados.'
    );
}
if (process.env.DB_MIGRATION_USER === process.env.DB_USER) {
    throw new Error(
        'A conta de migrations deve ser diferente da conta da aplicação.'
    );
}

const sslHabilitado =
    process.env.DB_SSL === 'true' ||
    (
        process.env.NODE_ENV === 'production' &&
        process.env.DB_SSL !== 'false'
    );

const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_MIGRATION_USER,
    password: process.env.DB_MIGRATION_PASSWORD,
    max: 1,
    ssl: sslHabilitado
        ? {
            rejectUnauthorized:
                process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false',
        }
        : false,
});

module.exports = pool;
