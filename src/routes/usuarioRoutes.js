
const express = require('express');

const usuarioController = require('../controllers/usuarioController');

const router = express.Router();

// =====================================================
// ROTAS DE USUARIO
// =====================================================

// POST /api/usuarios
router.post('/', usuarioController.cadastrarUsuario);

module.exports = router;
