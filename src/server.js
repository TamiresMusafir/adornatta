
require('dotenv').config();

const app = require('./app');
const { testarConexao } = require('./database/connection');
const mercadoPagoService = require('./services/mercadoPagoService');

const PORT = process.env.PORT || 3000;

async function iniciarServidor() {
    try {
        // Verifica a conexão com o banco
        await testarConexao();

        // Inicia o servidor somente após conectar
        app.listen(PORT, () => {
            console.log(`Servidor rodando em http://localhost:${PORT}`);
            mercadoPagoService.iniciarExpiracaoCheckouts();
        });

    } catch (error) {
        console.error('Não foi possível iniciar o backend.');
        process.exit(1);
    }
}

iniciarServidor();
