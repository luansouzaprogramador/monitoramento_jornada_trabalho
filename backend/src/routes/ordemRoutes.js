const express = require('express');
const router = express.Router();
const ordemController = require('../controllers/ordemController');
const autenticar = require('../middleware/auth');

// Todas as rotas autenticadas
router.use(autenticar);

router.post('/criar', ordemController.criarOrdem);
router.get('/', ordemController.listarOrdens);
router.put('/cancelar/:id', ordemController.cancelarOrdem);

module.exports = router;
