const pool = require('../migrationPool');

const categorias = [
    { id: 1, nome: 'Brincos' },
    { id: 2, nome: 'Conjuntos' },
    { id: 3, nome: 'Pulseiras' },
    { id: 4, nome: 'Cordões' },
];

const produtos = [
    {
        id: 1, nome: 'Brinco 2 em 1',
        descricao: 'Delicadeza e versatilidade em uma única peça.',
        preco: 39.99, quantidade: 0, categoriaId: 1, imagem: '/assets/images/brinco_2_em_1.jpeg',
    },
    {
        id: 2, nome: 'Brinco Flores',
        descricao: 'Uma peça delicada para completar seu estilo.',
        preco: 24.99, quantidade: 0, categoriaId: 1, imagem: '/assets/images/brinco_flores.jpeg',
    },
    {
        id: 3, nome: 'Conjunto Cruz',
        descricao: 'Elegância e significado em uma combinação especial.',
        preco: 49.99, quantidade: 2, categoriaId: 2, imagem: '/assets/images/conjunto_cruz.jpeg',
    },
    {
        id: 4, nome: 'Conjunto Ponto de Luz',
        descricao: 'Delicadeza e brilho para diferentes ocasiões.',
        preco: 59.99, quantidade: 3, categoriaId: 2, imagem: '/assets/images/conjunto_ponto_de_luz.jpeg',
    },
    {
        id: 5, nome: 'Pulseira Ponto de Luz',
        descricao: 'Um toque delicado de brilho para o seu visual.',
        preco: 34.99, quantidade: 3, categoriaId: 3, imagem: '/assets/images/pulseira_ponto_de_luz.jpeg',
    },
    {
        id: 6, nome: 'Bracelete Fino',
        descricao: 'Uma peça delicada e versátil para o dia a dia.',
        preco: 34.99, quantidade: 5, categoriaId: 3, imagem: '/assets/images/bracelete_fino.jpeg',
    },
    {
        id: 7, nome: 'Brinco Flor',
        descricao: 'Delicadeza e feminilidade em uma peça especial.',
        preco: 24.99, quantidade: 3, categoriaId: 1, imagem: '/assets/images/brinco_flor.jpeg',
    },
    {
        id: 8, nome: 'Brinco de Argola Tripla',
        descricao: 'Um modelo moderno para destacar seu estilo.',
        preco: 34.99, quantidade: 3, categoriaId: 1, imagem: '/assets/images/brinco_argola_tripla.jpeg',
    },
    {
        id: 9, nome: 'Bracelete Liso',
        descricao: 'Design minimalista e elegante.',
        preco: 59.99, quantidade: 3, categoriaId: 3, imagem: '/assets/images/bracelete_liso.jpeg',
    },
    {
        id: 10, nome: 'Choker Medalhas',
        descricao: 'Uma peça moderna para complementar diferentes looks.',
        preco: 39.99, quantidade: 3, categoriaId: 4, imagem: '/assets/images/choker_medalhas.jpeg',
    },
    {
        id: 11, nome: 'Gravatinha de Medalhas',
        descricao: 'Delicadeza e personalidade em um design especial.',
        preco: 44.99, quantidade: 3, categoriaId: 4, imagem: '/assets/images/gravatinha_medalhas.jpeg',
    },
];

function mesmosRegistros(atuais, esperados, chaves) {
    return atuais.length === esperados.length &&
        esperados.every((esperado, indice) =>
            chaves.every((chave) =>
                String(atuais[indice][chave]) === String(esperado[chave])
            )
        );
}

async function seedCatalogo() {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');
        await client.query(
            'SELECT pg_advisory_xact_lock($1, $2)',
            [1_447_311_437, 2]
        );

        const migrations = await client.query(
            `SELECT version
             FROM public.schema_migrations
             WHERE version = '001_app_role_privileges'`
        );
        if (!migrations.rows[0]) {
            throw new Error(
                'Aplique as migrations antes de carregar os seeds.'
            );
        }

        const categoriasAtuais = await client.query(
            'SELECT idcategoria AS id, nome FROM public.categoria ORDER BY idcategoria'
        );
        const produtosAtuais = await client.query(
            `SELECT idproduto AS id, nome, idcategoria AS "categoriaId"
             FROM public.produto
             ORDER BY idproduto`
        );

        if (
            (categoriasAtuais.rows.length > 0 &&
                !mesmosRegistros(categoriasAtuais.rows, categorias, ['id', 'nome'])) ||
            (produtosAtuais.rows.length > 0 &&
                !mesmosRegistros(produtosAtuais.rows, produtos, ['id', 'nome', 'categoriaId']))
        ) {
            throw new Error(
                'O catálogo existente não corresponde ao seed oficial; ' +
                'nenhum registro foi alterado.'
            );
        }

        for (const categoria of categorias) {
            await client.query(
                `INSERT INTO public.categoria (idcategoria, nome)
                 OVERRIDING SYSTEM VALUE
                 VALUES ($1, $2)
                 ON CONFLICT (idcategoria)
                 DO UPDATE SET nome = EXCLUDED.nome`,
                [categoria.id, categoria.nome]
            );
        }

        for (const produto of produtos) {
            await client.query(
                `INSERT INTO public.produto
                    (idproduto, nome, descricao, preco_unitario, material,
                     tipo_banho, quantidade, idcategoria)
                 OVERRIDING SYSTEM VALUE
                 VALUES ($1, $2, $3, $4, 'Semijoia', 'Ouro 18K', $5, $6)
                 ON CONFLICT (idproduto)
                 DO UPDATE SET
                    nome = EXCLUDED.nome,
                    descricao = EXCLUDED.descricao,
                    preco_unitario = EXCLUDED.preco_unitario,
                    material = EXCLUDED.material,
                    tipo_banho = EXCLUDED.tipo_banho,
                    idcategoria = EXCLUDED.idcategoria`,
                [
                    produto.id,
                    produto.nome,
                    produto.descricao,
                    produto.preco,
                    produto.quantidade,
                    produto.categoriaId,
                ]
            );
            await client.query(
                `INSERT INTO public.imagem_produto (idproduto, url)
                 VALUES ($1, $2)
                 ON CONFLICT (idproduto, url) DO NOTHING`,
                [produto.id, produto.imagem]
            );
        }

        for (const [tabela, coluna] of [
            ['categoria', 'idcategoria'],
            ['produto', 'idproduto'],
        ]) {
            await client.query(
                `SELECT setval(
                    pg_get_serial_sequence('public.${tabela}', '${coluna}'),
                    GREATEST((SELECT COALESCE(MAX(${coluna}), 1) FROM public.${tabela}), 1),
                    EXISTS (SELECT 1 FROM public.${tabela})
                )`
            );
        }

        await client.query('COMMIT');
        console.log('Seeds do catálogo aplicados: 4 categorias e 11 produtos.');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

seedCatalogo().catch((error) => {
    console.error('Falha ao aplicar seeds:', error.message);
    process.exitCode = 1;
});
