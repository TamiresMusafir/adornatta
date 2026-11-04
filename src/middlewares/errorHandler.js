function errorHandler(err, req, res, next) {
    console.error(err);

    const statusCode = err.statusCode || 500;

    const message =
        statusCode === 500
            ? 'Erro interno do servidor.'
            : err.message;

    res.status(statusCode).json({
        status: 'error',
        message,
    });
}

module.exports = errorHandler;
