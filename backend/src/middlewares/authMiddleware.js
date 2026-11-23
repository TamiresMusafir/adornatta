const jwt = require('jsonwebtoken');

function autenticar(req, res, next) {
    if (!process.env.JWT_SECRET) {
        const erro = new Error('JWT_SECRET não está configurada.');
        erro.statusCode = 500;
        return next(erro);
    }

    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({
            status: 'error',
            message: 'Autenticação necessária.',
        });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET, {
            algorithms: ['HS256'],
        });
        const idusuario = Number(payload.sub);

        if (
            !Number.isSafeInteger(idusuario) ||
            idusuario < 1 ||
            typeof payload.perfil !== 'string'
        ) {
            return res.status(401).json({
                status: 'error',
                message: 'Sessão inválida.',
            });
        }

        req.usuarioAutenticado = {
            idusuario,
            perfil: payload.perfil,
        };
        res.set('Cache-Control', 'no-store');

        return next();
    } catch (error) {
        if (
            error instanceof jwt.JsonWebTokenError ||
            error instanceof jwt.TokenExpiredError
        ) {
            return res.status(401).json({
                status: 'error',
                message: 'Sessão inválida ou expirada.',
            });
        }

        return next(error);
    }
}

function exigirAdministrador(req, res, next) {
    if (req.usuarioAutenticado?.perfil !== 'administrador') {
        return res.status(403).json({
            status: 'error',
            message: 'Acesso restrito a administradores.',
        });
    }

    return next();
}

function exigirProprietarioOuAdministrador(parametroId) {
    return (req, res, next) => {
        const { idusuario, perfil } = req.usuarioAutenticado;

        if (
            perfil === 'administrador' ||
            String(req.params[parametroId]) === String(idusuario)
        ) {
            return next();
        }

        return res.status(403).json({
            status: 'error',
            message: 'Você não tem permissão para acessar estes dados.',
        });
    };
}

module.exports = {
    autenticar,
    exigirAdministrador,
    exigirProprietarioOuAdministrador,
};
