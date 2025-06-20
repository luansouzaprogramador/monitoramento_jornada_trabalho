const db = require('../config/db');

// Atualizar presença dos membros e tempos cumpridos
exports.atualizarJornada = (req, res) => {
  const { ordem_id, presencas, tempos } = req.body;

  // Atualiza presença
  presencas.forEach(({ membro_id, presente }) => {
    db.query(
      'UPDATE membros_ordem SET presente = ? WHERE ordem_id = ? AND membro_id = ?',
      [presente, ordem_id, membro_id]
    );
  });

  // Se algum tempo não foi cumprido, já podemos solicitar aprovação
  const { plataforma, ida, volta, manobra } = tempos;
  let precisaAprovacao = false;

  [plataforma, ida, volta, manobra].forEach((t) => {
    if (t.cumprido === false) precisaAprovacao = true;
  });

  if (precisaAprovacao) {
    db.query('INSERT INTO aprovacoes_jornada (ordem_id, aprovado, justificativa) VALUES (?, NULL, NULL)', [ordem_id]);
  }

  res.status(200).json({ mensagem: 'Jornada registrada com sucesso' });
};

exports.aprovarJornada = (req, res) => {
  const { id } = req.params;
  const { aprovado, justificativa } = req.body;

  db.query(
    'UPDATE aprovacoes_jornada SET aprovado = ?, justificativa = ?, data_aprovacao = NOW() WHERE id = ?',
    [aprovado, justificativa || null, id],
    (err) => {
      if (err) return res.status(500).json({ erro: 'Erro ao aprovar jornada', detalhes: err });

      res.status(200).json({ mensagem: 'Jornada analisada com sucesso' });
    }
  );
};

exports.getSolicitacoesPendentes = (req, res) => {
  const { id } = req.usuario;

  const query = `
    SELECT a.id, a.ordem_id, o.numero_servico
    FROM aprovacoes_jornada a
    JOIN ordens_servico o ON o.id = a.ordem_id
    WHERE a.aprovado IS NULL AND o.supervisor_id = ?
  `;

  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ erro: 'Erro ao buscar solicitações', detalhes: err });

    res.status(200).json(results);
  });
};

exports.statusJornada = (req, res) => {
  const { ordem_id } = req.params;

  db.query(
    'SELECT aprovado, justificativa FROM aprovacoes_jornada WHERE ordem_id = ?',
    [ordem_id],
    (err, results) => {
      if (err) return res.status(500).json({ erro: 'Erro ao buscar status' });

      res.status(200).json(results[0] || { aprovado: null });
    }
  );
};
