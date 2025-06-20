const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const autenticar = require('../middleware/auth');

// Rota pública (login)
router.post('/login', usuarioController.login);

// Rota protegida (cadastro só para gestor)
router.post('/criar', autenticar, (req, res, next) => {
  if (req.usuario.tipo !== 'gestor') {
    return res.status(403).json({ erro: 'Apenas gestores podem criar usuários' });
  }
  next();
}, usuarioController.criarUsuario);

module.exports = router;
