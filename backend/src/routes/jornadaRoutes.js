const express = require('express');
const router = express.Router();
const jornada = require('../controllers/jornadaController');
const autenticar = require('../middleware/auth');

router.use(autenticar);

router.post('/atualizar', jornada.atualizarJornada);
router.put('/aprovar/:id', jornada.aprovarJornada);
router.get('/solicitacoes', jornada.getSolicitacoesPendentes);
router.get('/status/:ordem_id', jornada.statusJornada);

module.exports = router;
