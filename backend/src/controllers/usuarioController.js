
const jwt = require('jsonwebtoken');

const usuarioService = require('../services/usuarioService');

function definirCookieSessao(res, usuario) {
    const token = jwt.sign(
        {
            perfil: usuario.perfil === 'admin'
                ? 'administrador'
                : usuario.perfil,
        },
        process.env.JWT_SECRET,
        {
            algorithm: 'HS256',
            subject: String(usuario.id),
            expiresIn: '1h',
        }
    );

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 1000,
        path: '/',
    });
    res.set('Cache-Control', 'no-store');
}

// =====================================================
// CADASTRAR USUARIO
// =====================================================

async function cadastrarUsuario(req, res, next) {
    try {
        if (!process.env.JWT_SECRET) {
            const erro = new Error('JWT_SECRET não está configurada.');
            erro.statusCode = 500;
            throw erro;
        }

        const usuario = await usuarioService.cadastrarUsuario(req.body);

        definirCookieSessao(res, usuario);
        return res.status(201).json(usuario);

    } catch (error) {

        next(error);

    }
}

async function loginUsuario(req, res, next) {
    try {
        if (!process.env.JWT_SECRET) {
            const erro = new Error('JWT_SECRET não está configurada.');
            erro.statusCode = 500;
            throw erro;
        }

        const usuario = await usuarioService.autenticarUsuario(req.body);

        if (!usuario) {
            return res.status(401).json({
                status: 'error',
                message: 'E-mail ou senha inválidos.',
            });
        }

        definirCookieSessao(res, usuario);

        return res.status(200).json(usuario);
    } catch (error) {
        next(error);
    }
}

async function verificarSessao(req, res, next) {
    try {
        const usuario = await usuarioService.buscarUsuarioPorId(
            req.usuarioAutenticado.idusuario
        );
        if (!usuario) {
            return res.status(401).json({
                status: 'error',
                message: 'Sessão inválida.',
            });
        }
        res.set('Cache-Control', 'no-store');
        return res.status(200).json(usuario);
    } catch (error) {
        return next(error);
    }
}

function logoutUsuario(req, res) {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
    });
    res.set('Cache-Control', 'no-store');

    return res.status(204).send();
}

async function buscarUsuario(req, res, next) {
    try {
        const usuario = await usuarioService.buscarUsuarioPorId(req.params.id);
        if (!usuario) {
            return res.status(404).json({
                status: 'error',
                message: 'Usuário não encontrado.',
            });
        }

        return res.status(200).json(usuario);
    } catch (error) {
        return next(error);
    }
}

async function listarUsuarios(req, res, next) {
    try {
        return res.status(200).json(await usuarioService.listarUsuarios());
    } catch (error) {
        return next(error);
    }
}

async function atualizarUsuario(req, res, next) {
    try {
        const usuario = await usuarioService.atualizarUsuario(
            req.params.id,
            req.body
        );
        if (!usuario) {
            return res.status(404).json({
                status: 'error',
                message: 'Usuário não encontrado.',
            });
        }

        return res.status(200).json(usuario);
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    cadastrarUsuario,
    loginUsuario,
    logoutUsuario,
    verificarSessao,
    buscarUsuario,
    listarUsuarios,
    atualizarUsuario,
};
