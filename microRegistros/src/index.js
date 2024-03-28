const express = require('express');
const bodyParser = require('body-parser');
const controller = require('./controller'); // Importar el módulo del controlador
const jwt = require('jsonwebtoken');
const app = express();
const PORT = process.env.PORT || 3000;
const model = require('./model');

// Middleware para parsear cuerpos de solicitud en JSON
app.use(bodyParser.json());

app.post('/registroDesdeUsuarios', (req, res) => {
  const { userEmail, userType, token } = req.body;

  // Verificar el token recibido
  jwt.verify(token, 'e07ccacdd185bd42aa048adf174f46e52bcfa4ef47968a6aff9c5f79d2ce96c4', (err, decoded) => {
    if (err) {
      console.error('Error al verificar el token:', err);
      return res.status(401).json({ error: 'Token inválido' });
    }

    // Verificar que el token provenga del microservicio de usuarios
    if (decoded.userType !== userType || decoded.userEmail !== userEmail) {
      console.error('Token no coincide con el usuario proporcionado');
      return res.status(401).json({ error: 'Token no coincide con el usuario proporcionado' });
    }

    // Si userType es 'paciente', obtener los registros correspondientes al paciente
    if (userType === 'paciente') {
      // Llamada a la función para obtener los registros del paciente
      model.obtenerRegistroPaciente(userEmail) // Utilizamos el correo electrónico como identificador del paciente
        .then(registros => {
          // Devolver los registros obtenidos como respuesta
          res.status(200).json(registros);
        })
        .catch(error => {
          console.error("Error al obtener los registros del paciente:", error.message);
          res.status(404).json({ error: 'Registros no encontrados para el paciente' });
        });
    } else {
      // Manejar otros tipos de usuario aquí si es necesario
      res.status(200).json({ message: 'Usuario no identificado como paciente' });
    }
  });
});
// Usar las rutas definidas en el controlador
app.use('/', controller);

// Iniciar el servidor Express
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
