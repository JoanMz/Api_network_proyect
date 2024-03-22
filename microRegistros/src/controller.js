const express = require('express');
const model = require('./model'); // Importar el módulo del modelo

const router = express.Router();

// Ruta protegida para obtener pacientes atendidos por el médico autenticado
// router.get('/medico/pacientes', autenticarMedico, async (req, res) => {
//     const doctorId = req.doctorId;
  
//     try {
//       const registros = await obtenerRegistrosMedico(doctorId);
//       res.json(registros);
//     } catch (error) {
//       console.error('Error al obtener pacientes atendidos por el médico:', error);
//       res.status(500).json({ error: 'Error al obtener pacientes atendidos por el médico' });
//     }
//   });

// Ruta GET para el dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const estadisticas = await model.obtenerEstadisticas();
    res.json(estadisticas);
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

// Ruta para iniciar sesión como administrador
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Verificar si el nombre de usuario y la contraseña son válidos
  if (username === 'admin' && password === 'admin123') {
    // Si las credenciales son válidas, el inicio de sesión es exitoso
    res.status(200).json({ message: 'Inicio de sesión exitoso' });
  } else {
    // Si las credenciales no son válidas, devuelve un mensaje de error
    res.status(401).json({ message: 'Nombre de usuario o contraseña incorrectos' });
  }
});

// Ruta para obtener un registro de paciente por ID
router.get('/registro/:id', async (req, res) => {
  try {
    const pacienteId = req.params.id;

    // Llamada a la función para obtener el registro del paciente
    const registroPaciente = await model.obtenerRegistroPaciente(pacienteId);

    // Envía el registro del paciente como respuesta
    res.json(registroPaciente);
  } catch (error) {
    console.error('Error al obtener el registro del paciente:', error);
    res.status(500).send('Ocurrió un error al obtener el registro del paciente');
  }
});

// Ruta para agregar un nuevo registro
router.post('/registro', async (req, res) => {
  try {
    const nuevoRegistro = req.body;

    // Llamada a la función para agregar el nuevo registro de paciente
    await model.agregarRegistroPaciente(nuevoRegistro);

    res.status(201).send('Registro de paciente agregado correctamente');
  } catch (error) {
    console.error('Error al agregar un nuevo registro de paciente:', error);
    res.status(500).send('Ocurrió un error al agregar un nuevo registro de paciente');
  }
});

// Ruta para editar un registro existente
router.put('/registro/:id', async (req, res) => {
  try {
    const registroId = req.params.id;
    const datosActualizados = req.body;

    // Actualizar el registro en la base de datos
    await model.editarRegistroPaciente(registroId, datosActualizados);
    res.send('Registro actualizado exitosamente');
  } catch (error) {
    console.error('Error al actualizar el registro:', error);
    res.status(500).send('Ocurrió un error al actualizar el registro');
  }
});

// Ruta para cancelar un registro existente
router.delete('/registro/:id', async (req, res) => {
  try {
    const registroId = req.params.id;

    // Eliminar el registro de la base de datos
    await model.cancelarRegistro(registroId);

    res.send('Registro eliminado exitosamente');
  } catch (error) {
    console.error('Error al borrar el registro:', error);
    res.status(500).send('Ocurrió un error al borrar el registro');
  }
});

// Ruta para obtener estadísticas desde la base de datos
router.get('/estadisticas', async (req, res) => {
  try {
    // Llamamos a la función para obtener estadísticas desde la base de datos
    const estadisticas = await model.obtenerEstadisticas();

    // Enviamos las estadísticas como respuesta
    res.json(estadisticas);
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).send('Ocurrió un error al obtener estadísticas desde la base de datos');
  }
});

module.exports = router;
