const crypto = require('node:crypto');
const fs = require('node:fs/promises');
const path = require('node:path');
const pool = require('./migrationPool');

const MIGRATIONS_PATH = path.join(__dirname, 'migrations');
const LOCK_CLASS = 1_447_311_437;
const LOCK_OBJECT = 1;

async function runMigrations() {
    const client = await pool.connect();
    let lockAcquired = false;

    try {
        await client.query('SELECT pg_advisory_lock($1, $2)', [
            LOCK_CLASS,
            LOCK_OBJECT,
        ]);
        lockAcquired = true;

        await client.query(`
            CREATE TABLE IF NOT EXISTS public.schema_migrations (
                version VARCHAR(100) PRIMARY KEY,
                checksum CHAR(64) NOT NULL,
                applied_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                applied_by VARCHAR(100) NOT NULL DEFAULT session_user
            )
        `);
        await client.query(
            'REVOKE ALL ON public.schema_migrations FROM PUBLIC, adornatta_app'
        );

        const files = (await fs.readdir(MIGRATIONS_PATH))
            .filter((file) => /^\d{3}_[a-z0-9_]+\.sql$/.test(file))
            .sort();
        if (files.length === 0) {
            throw new Error('Nenhuma migration válida encontrada.');
        }

        const appliedResult = await client.query(
            'SELECT version, checksum FROM public.schema_migrations'
        );
        const applied = new Map(
            appliedResult.rows.map((row) => [row.version, row.checksum])
        );

        for (const file of files) {
            const version = file.slice(0, -4);
            const sql = await fs.readFile(
                path.join(MIGRATIONS_PATH, file),
                'utf8'
            );
            const checksum = crypto
                .createHash('sha256')
                .update(sql)
                .digest('hex');
            const priorChecksum = applied.get(version);

            if (priorChecksum) {
                if (priorChecksum.trim() !== checksum) {
                    throw new Error(
                        `A migration aplicada ${version} foi alterada. ` +
                        'Crie uma nova migration em vez de editar o histórico.'
                    );
                }
                continue;
            }

            await client.query('BEGIN');
            try {
                await client.query(sql);
                await client.query(
                    `INSERT INTO public.schema_migrations (version, checksum)
                     VALUES ($1, $2)`,
                    [version, checksum]
                );
                await client.query('COMMIT');
                console.log(`Migration aplicada: ${version}`);
            } catch (error) {
                await client.query('ROLLBACK');
                throw error;
            }
        }
    } finally {
        if (lockAcquired) {
            await client.query('SELECT pg_advisory_unlock($1, $2)', [
                LOCK_CLASS,
                LOCK_OBJECT,
            ]);
        }
        client.release();
        await pool.end();
    }
}

runMigrations().catch((error) => {
    console.error('Falha ao aplicar migrations:', error.message);
    process.exitCode = 1;
});
