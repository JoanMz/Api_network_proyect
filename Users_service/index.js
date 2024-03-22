const express = require('express');
const bodyParser = require('body-parser');
const usuariosController = require('./controllers/usuarioController');


const app = express();
const PORT = 3000;

// Middleware para analizar el cuerpo de las solicitudes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
});
