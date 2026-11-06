const express = require('express');

const pedidoController = require('../controllers/pedidoController');
const {
    autenticar,
    exigirAdministrador,
} = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/pedidos', autenticar, pedidoController.listarPedidos);
router.post('/pedidos', autenticar, pedidoController.criarPedido);
router.get(
    '/pedidos/:id',
    autenticar,
    pedidoController.buscarPedido
);
router.patch(
    '/pedidos/:id',
    autenticar,
    exigirAdministrador,
    pedidoController.atualizarPedido
);

router.get('/itensPedido', autenticar, pedidoController.listarItensPedido);
router.post('/itensPedido', autenticar, pedidoController.criarItemPedido);

router.get(
    '/vendas',
    autenticar,
    exigirAdministrador,
    pedidoController.listarVendas
);

module.exports = router;
