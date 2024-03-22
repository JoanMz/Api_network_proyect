const express = require('express');
const usuariosController = require('./src/Controllers/usuarioController');

const app = express();
const PORT = 3002;

// Middleware para analizar el cuerpo de las solicitudes
app.use(bodyParser.json());

// Ruta principal
app.use('/api', usuariosController); // Todas las solicitudes a /api serán manejadas por el controlador de usuarios

// Manejador de errores para rutas no encontradas
app.use((req, res, next) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

// Manejador de errores para errores internos del servidor
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Error interno del servidor' });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
});