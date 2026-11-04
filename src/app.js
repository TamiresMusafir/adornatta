
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const usuarioRoutes = require('./routes/usuarioRoutes');

const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Configuração do CORS para permitir cookies
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    })
);

// Middlewares globais
app.use(express.json());
app.use(cookieParser());

// =====================================================
// ROTAS DA APLICAÇÃO
// =====================================================

// Verificar se o backend está funcionando
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'Backend Adornatta funcionando!',
    });
});

// Rotas de usuários
app.use('/api/usuarios', usuarioRoutes);

// =====================================================
// TRATAMENTO DE ERROS
// =====================================================

// Tratamento de rotas inexistentes
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: `Rota ${req.method} ${req.originalUrl} não encontrada.`,
    });
});

// Tratamento centralizado de erros
app.use(errorHandler);

module.exports = app;
