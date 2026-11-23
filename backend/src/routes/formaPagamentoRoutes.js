const express = require('express');

const controller = require('../controllers/formaPagamentoController');
const { autenticar } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use('/formasPagamento', autenticar);
router.get('/formasPagamento', controller.listar);
router.post('/formasPagamento', controller.criar);
router.patch('/formasPagamento/:id', controller.atualizar);
router.delete('/formasPagamento/:id', controller.excluir);

module.exports = router;
