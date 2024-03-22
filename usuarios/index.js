const express = require('express');
const app = express();
const usuarioRouter = require('./src/controllers/usuarioController');

// Middleware para manejar solicitudes JSON
app.use(express.json());

// Puerto en el que se ejecutará el servidor
const PORT = process.env.PORT || 3004;

// Middleware para registrar la solicitud
app.use((req, res, next) => {
  console.log('Solicitud recibida:');
  console.log(req.body); // Imprimir el cuerpo de la solicitud
  next(); // Pasar al siguiente middleware
});


// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor de usuarios escuchando en el puerto ${PORT}`);
});
