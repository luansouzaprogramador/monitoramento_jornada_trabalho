const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.criarUsuario = async (req, res) => {
  const { matricula, senha, nome, tipo, telefone, email } = req.body;

  if (!matricula || !senha || !nome || !tipo) {
    return res.status(400).json({ erro: 'Dados obrigatórios faltando' });
  }

  const senhaHash = await bcrypt.hash(senha, 10);

  db.query(
    'INSERT INTO usuarios (matricula, senha, nome, tipo, telefone, email) VALUES (?, ?, ?, ?, ?, ?)',
    [matricula, senhaHash, nome, tipo, telefone, email],
    (err) => {
      if (err) {
        return res.status(500).json({ erro: 'Erro ao criar usuário', detalhes: err });
      }
      res.status(201).json({ mensagem: 'Usuário criado com sucesso' });
    }
  );
};

exports.login = (req, res) => {
  const { matricula, senha } = req.body;

  db.query('SELECT * FROM usuarios WHERE matricula = ?', [matricula], async (err, resultados) => {
    if (err || resultados.length === 0) {
      return res.status(401).json({ erro: 'Usuário ou senha inválidos' });
    }

    const usuario = resultados[0];
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'Usuário ou senha inválidos' });
    }

    const token = jwt.sign(
      { id: usuario.id, tipo: usuario.tipo, nome: usuario.nome },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.status(200).json({ token, usuario: { nome: usuario.nome, tipo: usuario.tipo, id: usuario.id } });
  });
};
