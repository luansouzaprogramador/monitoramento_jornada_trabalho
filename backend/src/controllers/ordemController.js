const db = require('../config/db');

// Criação de nova ordem (Supervisor)
exports.criarOrdem = (req, res) => {
  const {
    numero_servico,
    encarregado_id,
    membros_ids,
    equipamentos,
    local_lat,
    local_lng,
    tempo_plataforma,
    deslocamento_ida,
    deslocamento_volta,
    manobra
  } = req.body;

  const supervisor_id = req.usuario.id;

  // 1. Insere ordem
  const ordemQuery = `
    INSERT INTO ordens_servico 
    (numero_servico, supervisor_id, encarregado_id, local_lat, local_lng,
     tempo_plataforma, deslocamento_ida, deslocamento_volta, manobra)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(
    ordemQuery,
    [numero_servico, supervisor_id, encarregado_id, local_lat, local_lng, tempo_plataforma, deslocamento_ida, deslocamento_volta, manobra],
    (err, result) => {
      if (err) return res.status(500).json({ erro: 'Erro ao criar ordem', detalhes: err });

      const ordemId = result.insertId;

      // 2. Insere membros
      membros_ids.forEach((membro_id) => {
        db.query('INSERT INTO membros_ordem (ordem_id, membro_id) VALUES (?, ?)', [ordemId, membro_id]);
      });

      // 3. Insere equipamentos
      equipamentos.forEach((item) => {
        db.query(
          'INSERT INTO ordem_equipamentos (ordem_id, equipamento_id, local_lat, local_lng) VALUES (?, ?, ?, ?)',
          [ordemId, item.id, item.lat, item.lng]
        );
      });

      res.status(201).json({ mensagem: 'Ordem criada com sucesso', ordemId });
    }
  );
};

// Listar ordens visíveis ao usuário (Gestor, Supervisor ou Encarregado)
exports.listarOrdens = (req, res) => {
  const { tipo, id } = req.usuario;

  let query = `SELECT * FROM ordens_servico`;
  let params = [];

  if (tipo === 'supervisor') {
    query += ' WHERE supervisor_id = ?';
    params = [id];
  } else if (tipo === 'encarregado') {
    query += ' WHERE encarregado_id = ?';
    params = [id];
  }

  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ erro: 'Erro ao buscar ordens', detalhes: err });

    res.status(200).json(results);
  });
};

// Cancelar ordem (Supervisor ou Gestor)
exports.cancelarOrdem = (req, res) => {
  const { id } = req.params;

  db.query('UPDATE ordens_servico SET status = "cancelada" WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ erro: 'Erro ao cancelar ordem', detalhes: err });

    res.status(200).json({ mensagem: 'Ordem cancelada com sucesso' });
  });
};
