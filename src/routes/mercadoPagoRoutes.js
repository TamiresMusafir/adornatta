const express = require('express');

const controller = require('../controllers/mercadoPagoController');
const { autenticar } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/pagamentos/mercado-pago/webhook', controller.receberWebhook);
router.post('/pedidos/:id/checkout', autenticar, controller.criarCheckout);

module.exports = router;
