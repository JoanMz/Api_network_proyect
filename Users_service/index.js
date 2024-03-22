const express = require('express');
const bodyParser = require('body-parser');
const adminController = require('./controllers/adminController');
const pacienteController = require('./controllers/pacienteController');
const medicoController = require('./controllers/medicoController');

const app = express();
const PORT = 3000;

// Middleware para analizar el cuerpo de las solicitudes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Rutas para el controlador de administrador
app.use('/admin', adminController);

// Rutas para el controlador de paciente
app.use('/paciente', pacienteController);

// Rutas para el controlador de médico
app.use('/medico', medicoController);

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
});
