// importar Express y otras dependencias
const express = require('express');
const mysql = require('mysql');

// crear una instancia de Express
const app = express();
const PORT = process.env.PORT || 3001;
const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.set('view engine', 'ejs');

// Conexión a la base de datos MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'clinica'
});

// establecer conexión a la bd
connection.connect((err) => {
  if (err) {
    console.error('Error de conexión:', err);
    return;
  }
  console.log('Conexión a la base de datos MySQL establecida');
});

//funcion para obtener las citas de un dia especifico
function obtenerCitasPorDia(fecha) {
  return new Promise((resolve, reject) => {
    // Consulta SQL para obtener las citas programadas para una fecha específica
    const query = 'SELECT * FROM citas WHERE `medical appointment day` = ?';
    connection.query(query, [fecha], (error, results) => {
      if (error) {
        reject(new Error(`Error obteniendo citas para la fecha ${fecha}: ${error.message}`));
      } else {
        resolve(results); // Enviar los resultados de la consulta
      }
    });
  });
}

async function agregarNuevaCita(nuevaCita) {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO citas (`Name`, `Medical Condition`, `medical appointment day`, `Insurance Provider`, `Horario`, `number`) VALUES (?, ?, ?, ?, ?, ?)';
    connection.query(query, [nuevaCita.Name, nuevaCita["Medical Condition"], nuevaCita["medical appointment day"], nuevaCita["Insurance Provider"], nuevaCita.Horario, nuevaCita.number], (error, resultado) => {
      if (error) {
        reject(error);
      } else {
        resolve(resultado);
      }
    });
  });
}

async function editarCita(citaId, datosActualizados) {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE citas SET ? WHERE id = ?';
    connection.query(query, [datosActualizados, citaId], (error, resultado) => {
      if (error) {
        reject(error);
      } else {
        resolve(resultado);
      }
    });
  });
}

async function cancelarCita(citaId) {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM citas WHERE id = ?';
    connection.query(query, citaId, (error, resultado) => {
      if (error) {
        reject(error);
      } else {
        resolve(resultado);
      }
    });
  });
}

// funcion para obtener estadísticas desde la bd de MySQL
async function obtenerEstadisticas() {
  try {
    // Define all the queries as an array of strings
    const queries = [
      'SELECT `Medical Condition` AS condicion_medica, COUNT(*) AS total_citas FROM citas GROUP BY `Medical Condition`',
      'SELECT Gender, COUNT(*) AS total_pacientes FROM pacientes GROUP BY Gender',
      'SELECT DAYNAME(`medical appointment day`) AS dia_semana, COUNT(*) AS total_citas FROM citas GROUP BY dia_semana',
    ];

    // Execute all the queries concurrently using Promise.all()
    const results = await Promise.all(queries.map(query => new Promise((resolve, reject) => {
      connection.query(query, (error, data, fields) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    })));

    // Procesar los resultados
    const estadisticas = {
      citasPorCondicion: results[0],
      pacientesPorGenero: results[1],
      citasPorDiaSemana: results[2],
    };

    return estadisticas;
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    throw error; // Reenviar el error para que el controlador lo maneje
  }
}





// Ruta para iniciar sesión como administrador
app.post('/login', (req, res) => {
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


// Definir ruta para el dashboard
app.get('/dashboard', async (req, res) => {
  try {
    const { fecha } = req.query;

    if (!fecha) {
      return res.status(400).send('A specific date must be provided');
    }

    const dateFormat = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateFormat.test(fecha)) {
      return res.status(400).send('Invalid date format. Please use YYYY-MM-DD');
    }

    const [citasProgramadas, estadisticas] = await Promise.all([
      obtenerCitasPorDia(fecha),
      obtenerEstadisticas(fecha) // llamamos tambien a la funcion obtenerEstadisticas() para que se integre al dashboard
    ]);

    res.render('dashboard', { citasProgramadas, estadisticas });

  } catch (error) {
    console.error('Error getting data for dashboard:', error);
    return res.status(500).send('An error occurred while getting data for dashboard');
  }
});


// Ruta para agregar una nueva cita
app.post('/citas', async (req, res) => {
  try {
    console.log(req.body);
    // Obtener los datos de la nueva cita desde la solicitud
    const nuevaCita = {
      Name: req.body.Name,
      "Medical Condition": req.body['Medical Condition'],
      "medical appointment day": req.body['medical appointment day'],
      "Insurance Provider": req.body['Insurance Provider'],
      Horario: req.body.Horario,
      number: req.body.number
    };

    // Insertar la nueva cita en la base de datos
    const resultado = await agregarNuevaCita(nuevaCita);

    res.status(201).send('Cita agregada correctamente');
  } catch (error) {
    console.error('Error al agregar una nueva cita:', error);
    res.status(500).send('Ocurrió un error al agregar una nueva cita');
  }
});



// Ruta para editar una cita existente
app.put('/citas/:id', async (req, res) => {
  try {
    const citaId = req.params.id;
    const datosActualizados = req.body;

    // Actualizar la cita en la base de datos
    await editarCita(citaId, datosActualizados);

    res.send('Cita actualizada correctamente');
  } catch (error) {
    console.error('Error al actualizar la cita:', error);
    res.status(500).send('Ocurrió un error al actualizar la cita');
  }
});

// Ruta para cancelar una cita existente
app.delete('/citas/:id', async (req, res) => {
  try {
    const citaId = req.params.id;

    // Eliminar la cita de la base de datos
    await cancelarCita(citaId);

    res.send('Cita cancelada correctamente');
  } catch (error) {
    console.error('Error al cancelar la cita:', error);
    res.status(500).send('Ocurrió un error al cancelar la cita');
  }
});

// Ruta para obtener estadísticas sobre la gestión de citas y demás información de los pacientes
// Ruta para obtener estadísticas desde la base de datos
app.get('/estadisticas', async (req, res) => {
  try {
    // Llamamos a la función para obtener estadísticas desde la base de datos
    const estadisticas = await obtenerEstadisticas();

    // Enviamos las estadísticas como respuesta
    res.json(estadisticas);
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).send('Ocurrió un error al obtener estadísticas desde la base de datos');
  }
});


// Otras rutas y controladores aquí...

// Iniciar el servidor Express
app.listen(PORT, () => {
  console.log(`Servidor funcionando en el puerto ${PORT}`);
});
