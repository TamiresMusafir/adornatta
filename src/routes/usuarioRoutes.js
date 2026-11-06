
const express = require('express');

const usuarioController = require('../controllers/usuarioController');
const {
    autenticar,
    exigirAdministrador,
    exigirProprietarioOuAdministrador,
} = require('../middlewares/authMiddleware');

const router = express.Router();

// =====================================================
// ROTAS DE USUARIO
// =====================================================

// POST /api/usuarios
router.post('/', usuarioController.cadastrarUsuario);

// POST /api/usuarios/login
router.post('/login', usuarioController.loginUsuario);
router.post('/logout', usuarioController.logoutUsuario);
router.get('/sessao', autenticar, usuarioController.verificarSessao);

// Dados pessoais não são disponibilizados publicamente.
router.get(
    '/',
    autenticar,
    exigirAdministrador,
    usuarioController.listarUsuarios
);
router.get(
    '/:id',
    autenticar,
    exigirProprietarioOuAdministrador('id'),
    usuarioController.buscarUsuario
);
router.patch(
    '/:id',
    autenticar,
    exigirProprietarioOuAdministrador('id'),
    usuarioController.atualizarUsuario
);

module.exports = router;
