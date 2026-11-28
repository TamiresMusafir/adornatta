require('dotenv').config();

const API_URL = (
    process.env.TEST_API_URL ||
    process.env.VITE_API_URL ||
    'http://localhost:3000/api'
).replace(/\/+$/, '');

const resultados = [];

function registrar(nome, passou, detalhe = '') {
    resultados.push({ nome, passou, detalhe });
    console.log(`${passou ? 'PASS' : 'FAIL'} ${nome}${detalhe ? ` - ${detalhe}` : ''}`);
}

async function requisitar(caminho, opcoes = {}) {
    const resposta = await fetch(`${API_URL}${caminho}`, opcoes);
    const contentType = resposta.headers.get('content-type') || '';
    const corpo = contentType.includes('application/json')
        ? await resposta.json().catch(() => null)
        : await resposta.text().catch(() => '');
    return { resposta, corpo };
}

async function testar(nome, verificacao) {
    try {
        await verificacao();
    } catch (erro) {
        registrar(nome, false, erro.message);
    }
}

async function main() {
    console.log(`Base da API: ${API_URL}`);

    await testar('API responde em /health', async () => {
        const { resposta, corpo } = await requisitar('/health');
        if (resposta.status !== 200) {
            throw new Error(`HTTP ${resposta.status}: ${corpo?.message || 'sem resposta'}`);
        }
        registrar('API responde em /health', true, 'status 200');
    });

    await testar('Catálogo público de categorias', async () => {
        const { resposta, corpo } = await requisitar('/categorias');
        if (resposta.status !== 200 || !Array.isArray(corpo)) {
            throw new Error(`esperado 200 com lista; recebido ${resposta.status}`);
        }
        registrar('Catálogo público de categorias', true, `${corpo.length} categorias`);
    });

    await testar('Catálogo público de produtos', async () => {
        const { resposta, corpo } = await requisitar('/produtos');
        if (resposta.status !== 200 || !Array.isArray(corpo)) {
            throw new Error(`esperado 200 com lista; recebido ${resposta.status}`);
        }
        registrar('Catálogo público de produtos', true, `${corpo.length} produtos`);
    });

    await testar('Produto inexistente retorna 404', async () => {
        const { resposta } = await requisitar('/produtos/2147483647');
        if (resposta.status !== 404) {
            throw new Error(`esperado 404; recebido ${resposta.status}`);
        }
        registrar('Produto inexistente retorna 404', true);
    });

    await testar('Sessão protegida rejeita chamada anônima', async () => {
        const { resposta } = await requisitar('/usuarios/sessao');
        if (resposta.status !== 401) {
            throw new Error(`esperado 401; recebido ${resposta.status}`);
        }
        registrar('Sessão protegida rejeita chamada anônima', true);
    });

    await testar('Pedidos protegidos rejeitam chamada anônima', async () => {
        const { resposta } = await requisitar('/pedidos');
        if (resposta.status !== 401) {
            throw new Error(`esperado 401; recebido ${resposta.status}`);
        }
        registrar('Pedidos protegidos rejeitam chamada anônima', true);
    });

    await testar('Produtos administrativos rejeitam chamada anônima', async () => {
        const { resposta } = await requisitar('/produtos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome: 'teste-anonimo' }),
        });
        if (resposta.status !== 401) {
            throw new Error(`esperado 401; recebido ${resposta.status}`);
        }
        registrar('Produtos administrativos rejeitam chamada anônima', true);
    });

    const falhas = resultados.filter((resultado) => !resultado.passou);
    console.log(`\nResultado: ${resultados.length - falhas.length}/${resultados.length} verificações passaram.`);
    if (falhas.length > 0) {
        process.exitCode = 1;
    }
}

main().catch((erro) => {
    console.error('FALHA AO EXECUTAR TESTE HTTP:', erro.message);
    process.exitCode = 1;
});
