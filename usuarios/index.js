const express = require('express');
const app = express();
const usuarioRouter = require('./src/controllers/usuarioController');

// Middleware para manejar solicitudes JSON
app.use(express.json());

// Puerto en el que se ejecutará el servidor
const PORT = process.env.PORT || 3002;

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor de usuarios escuchando en el puerto ${PORT}`);
});
