const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

const usuarioRoutes = require('./src/routes/usuarioRoutes');
const ordemRoutes = require('./src/routes/ordemRoutes');

app.use(cors());
app.use(express.json());

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/ordens', ordemRoutes);


app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
