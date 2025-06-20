const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

// Aqui futuramente vamos importar as rotas
// Ex: app.use('/api/usuarios', require('./src/routes/usuarios'));

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
