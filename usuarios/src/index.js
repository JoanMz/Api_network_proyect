// const express = require('express');
// const app = express();
// const usuarioRouter = require('./src/controllers/usuarioController');

// // Middleware para manejar solicitudes JSON
// app.use(express.json());

// // Puerto en el que se ejecutará el servidor
// const PORT = process.env.PORT || 3004;

// // Middleware para registrar la solicitud
// app.use((req, res, next) => {
//   console.log('Solicitud recibida:');
//   console.log(req.body); // Imprimir el cuerpo de la solicitud
//   next(); // Pasar al siguiente middleware
// });


// // Iniciar el servidor
// app.listen(PORT, () => {
//   console.log(`Servidor de usuarios escuchando en el puerto ${PORT}`);
// });

const express = require('express');
const authController = require('./usuarioController');
const config = require('./config');
const mysql = require('mysql');

const app = express();
app.use(express.json());

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection(config.dbConfig);

// Definir la conexión y la clave secreta como propiedades de la aplicación
app.set('dbConnection', connection);
app.set('jwtSecret', config.jwtSecret);

// Rutas
app.post('/auth/login', authController.login);

// Inicia el servidor
const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Servidor de autenticación en ejecución en el puerto ${PORT}`);
});

