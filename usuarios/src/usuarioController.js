// const { Router } = require('express');
// const router = Router();
// const usuarioModel = require('../models/usuarioModel');

// router.get('/usuarios', async (req, res) => {
//   const usuarios = await usuarioModel.getAllUsuarios();
//   res.json(usuarios);
// });

// router.get('/usuarios/:id', async (req, res) => {
//   const id = req.params.id;
//   const usuario = await usuarioModel.getUsuarioById(id);
//   res.json(usuario);
// });

// router.post('/usuarios', async (req, res) => {
//   const nuevoUsuario = req.body;
//   await usuarioModel.createUsuario(nuevoUsuario);
//   res.send('Usuario creado correctamente');
// });

// router.put('/usuarios/:id', async (req, res) => {
//   const id = req.params.id;
//   const nuevoUsuario = req.body;
//   await usuarioModel.updateUsuarioById(id, nuevoUsuario);
//   res.send('Usuario actualizado correctamente');
// });

// router.delete('/usuarios/:id', async (req, res) => {
//   const id = req.params.id;
//   await usuarioModel.deleteUsuarioById(id);
//   res.send('Usuario eliminado correctamente');
// });

// module.exports = router;

//AUTENTICACION DE USUARIO
const jwt = require('jsonwebtoken');
const User = require('./usuarioModel'); // Importa el modelo de usuario
const config = require('./config');
const axios = require('axios');

function login(req, res) {
  const { user, password, userType } = req.body;

  let tableName;
  let userTypeString;

  // Determina la tabla y el tipo de usuario
  switch (userType) {
    case 1:
      tableName = 'users';
      userTypeString = 'paciente';
      break;
    case 2:
      tableName = 'doctors';
      userTypeString = 'doctor';
      break;
    case 3:
      // Si se selecciona el userType 3, se asume como admin
      tableName = null; // No se necesita una tabla para el admin
      userTypeString = 'admin';
      break;
    default:
      return res.status(400).json({ error: 'Tipo de usuario no válido' });
  }

  if (tableName) {
    // Realiza la búsqueda del usuario en la tabla correspondiente
    User.findOneByEmail(user, tableName, (user) => {
      console.log("Usuario encontrado:", user); // Registro de depuración
      if (!user) {
        console.log("Usuario no encontrado en la base de datos"); // Registro de depuración
        return res.status(401).json({ error: 'Credenciales vacías' }); // Si no se encuentra el usuario
      }

      // Verifica la contraseña en texto plano
      if (password === user.password) {
        console.log("Contraseña válida"); // Registro de depuración

        // Genera un token JWT
        const token = jwt.sign({ userEmail: user.user, userType: userTypeString }, config.jwtSecret, { expiresIn: '1h' });

        // Enviamos la información al microservicio de registro mediante una solicitud HTTP
        axios.post('http://localhost:3000/registroDesdeUsuarios', {
          userEmail: user.user, // Envía el correo electrónico en lugar del id del usuario
          userType: userTypeString,
          token: token
        })
        .then(response => {
          // Manejamos la respuesta del microservicio de registro aquí
          console.log("Respuesta del microservicio de registro:", response.data);
        })
        .catch(error => {
          // Manejamos los errores de la solicitud al microservicio de registro aquí
          console.error("Error al enviar la información al microservicio de registro:", error);
        });
        
        // Devuelve el token en la respuesta
        res.json({ token });
      } else {
        console.log("Contraseña inválida"); // Registro de depuración
        return res.status(401).json({ error: 'Credenciales inválidas' }); // Si la contraseña no coincide
      }
    });
  } else {
    // Si el userType es 3 (admin), se asume un usuario y contraseña predefinidos
    if (user === 'admin' && password === '12345') {
      console.log("Contraseña válida para admin"); // Registro de depuración

      // Genera un token JWT para el admin
      const token = jwt.sign({ userEmail: user, userType: userTypeString }, config.jwtSecret, { expiresIn: '1h' });

      // Envía el tipo de usuario y el token al microservicio 'registro'
      // Aquí deberías implementar la lógica para enviar la información al microservicio 'registro'
      // Puedes usar fetch, axios u otro método para hacer una solicitud HTTP al microservicio 'registro'

      // Devuelve el token en la respuesta
      res.json({ token });
    } else {
      console.log("Contraseña inválida para admin"); // Registro de depuración
      return res.status(401).json({ error: 'Credenciales inválidas para admin' });
    }
  }
}

module.exports = { login };





