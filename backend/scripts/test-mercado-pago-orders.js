require('dotenv').config();

const resultados = [];

function registrar(nome, passou, detalhe = '') {
    resultados.push({ nome, passou, detalhe });
    console.log(`${passou ? 'PASS' : 'FAIL'} ${nome}${detalhe ? ` - ${detalhe}` : ''}`);
}

async function main() {
    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
    const frontendUrl = process.env.FRONTEND_URL;
    const webhookSecret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;

    registrar(
        'Access token do Mercado Pago está configurado',
        Boolean(accessToken),
        accessToken ? 'valor presente; não exibido' : 'MERCADO_PAGO_ACCESS_TOKEN ausente'
    );
    registrar(
        'FRONTEND_URL está configurada',
        Boolean(frontendUrl),
        frontendUrl || 'FRONTEND_URL ausente'
    );
    registrar(
        'Secret do webhook está configurado',
        Boolean(webhookSecret),
        webhookSecret ? 'valor presente; não exibido' : 'MERCADO_PAGO_WEBHOOK_SECRET ausente'
    );

    if (accessToken) {
        try {
            const resposta = await fetch('https://api.mercadopago.com/users/me', {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            registrar(
                'Token Mercado Pago é aceito pela API',
                resposta.status === 200,
                `HTTP ${resposta.status}`
            );
        } catch (erro) {
            registrar(
                'Token Mercado Pago é aceito pela API',
                false,
                erro.message
            );
        }
    }

    if (frontendUrl) {
        try {
            const url = new URL(frontendUrl);
            registrar(
                'Produção usa URL HTTPS',
                process.env.NODE_ENV !== 'production' ||
                    url.protocol === 'https:',
                `${url.protocol}//${url.host}`
            );
        } catch {
            registrar('FRONTEND_URL é uma URL válida', false);
        }
    }

    registrar(
        'Teste homologado Pix/cartão exige execução manual',
        true,
        'use credenciais de teste e registre evidência no Manual de Operação'
    );

    const falhas = resultados.filter((resultado) => !resultado.passou);
    console.log(`\nResultado: ${resultados.length - falhas.length}/${resultados.length} verificações passaram.`);
    if (falhas.length > 0) {
        process.exitCode = 1;
    }
}

main().catch((erro) => {
    console.error('FALHA AO EXECUTAR TESTE DO MERCADO PAGO:', erro.message);
    process.exitCode = 1;
});
