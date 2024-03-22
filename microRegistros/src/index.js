const express = require('express');
const bodyParser = require('body-parser');
const controller = require('./controller'); // Importar el módulo del controlador

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear cuerpos de solicitud en JSON
app.use(bodyParser.json());

// Usar las rutas definidas en el controlador
app.use('/', controller);

// Iniciar el servidor Express
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
