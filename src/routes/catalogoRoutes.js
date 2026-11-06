const express = require('express');

const catalogoController = require('../controllers/catalogoController');
const {
    autenticar,
    exigirAdministrador,
} = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/categorias', catalogoController.listarCategorias);

router.get('/produtos', catalogoController.listarProdutos);
router.get('/produtos/:id', catalogoController.buscarProduto);
router.post(
    '/produtos',
    autenticar,
    exigirAdministrador,
    catalogoController.criarProduto
);
router.patch(
    '/produtos/:id',
    autenticar,
    exigirAdministrador,
    catalogoController.atualizarProduto
);
router.delete(
    '/produtos/:id',
    autenticar,
    exigirAdministrador,
    catalogoController.excluirProduto
);

module.exports = router;
