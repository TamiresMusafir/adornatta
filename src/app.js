const express = require('express');
const cors = require('cors');

const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
    })
);

app.use(express.json());

app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'Backend Adornatta funcionando!',
    });
});

app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: `Rota ${req.method} ${req.originalUrl} não encontrada.`,
    });
});

app.use(errorHandler);

module.exports = app;