
const usuarioService = require('../services/usuarioService');

// =====================================================
// CADASTRAR USUARIO
// =====================================================

async function cadastrarUsuario(req, res, next) {
    try {

        const usuario = await usuarioService.cadastrarUsuario(req.body);

        return res.status(201).json({
            mensagem: 'Usuário cadastrado com sucesso!',
            usuario,
        });

    } catch (error) {

        next(error);

    }
}

module.exports = {
    cadastrarUsuario,
};
