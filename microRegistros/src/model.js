const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mysql = require('mysql');

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
    console.error('Error of connection', err);
    return;
  }
  console.log('Database connection established');
});

function obtenerRegistroPaciente(pacienteId) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT `Name`, `Age`, `Gender`, `Blood Type`, `Insurance Provider`, `Medication`, `Doctor` FROM registro WHERE id = ?';
    connection.query(query, [pacienteId], (error, results) => {
      if (error) {
        reject(new Error(`An error occurred while getting the register ${pacienteId}: ${error.message}`));
      } else {
        if (results.length === 0) {
          reject(new Error(`No record found for patient with ID ${pacienteId}`));
        } else {
          resolve(results[0]); // Enviar el primer resultado de la consulta (debería ser único)
        }
      }
    });
  });
}

// async function obtenerRegistrosMedico(doctorId) {
//     return new Promise((resolve, reject) => {
//       const query = 'SELECT * FROM registro WHERE Doctor_user = ?';
//       connection.query(query, [doctorId], (error, results) => {
//         if (error) {
//           reject(new Error(`An error occurred while getting medical records for doctor ${doctorId}: ${error.message}`));
//         } else {
//           resolve(results);
//         }
//       });
//     });
//   }
function agregarRegistroPaciente(nuevoRegistro) {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO registro (`Name`, `Age`, `Gender`, `Blood Type`, `Insurance Provider`, `Medication`, `Doctor`) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const { name, age, gender, bloodType, insuranceProvider, medication, doctor } = nuevoRegistro;

    connection.query(query, [name, age, gender, bloodType, insuranceProvider, medication, doctor], (error, resultado) => {
      if (error) {
        reject(new Error(`Error al agregar un nuevo registro: ${error.message}`));
      } else {
        resolve(resultado);
      }
    });
  });
}

async function editarRegistroPaciente(registroId, datosActualizados) {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE registro SET ? WHERE id = ?';
    connection.query(query, [datosActualizados, registroId], (error, resultado) => {
      if (error) {
        reject(error);
      } else {
        resolve(resultado);
      }
    });
  });
}

async function cancelarRegistro(registroId) {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM registro WHERE id = ?';
    connection.query(query, registroId, (error, resultado) => {
      if (error) {
        reject(error);
      } else {
        resolve(resultado);
      }
    });
  });
}

async function obtenerEstadisticas() {
    try {
      // Define todas las consultas como un array de strings
      const queries = [
        'SELECT COUNT(*) AS Total_Patients FROM registro',
        'SELECT COUNT(*) AS Total_Doctors FROM doctors',
        'SELECT `Blood Type`, COUNT(*) AS Blood_Type_Count FROM registro GROUP BY `Blood Type` ORDER BY Blood_Type_Count DESC',
        'SELECT Medication, COUNT(*) AS Recommendation_Count FROM registro WHERE Medication IS NOT NULL GROUP BY Medication ORDER BY Recommendation_Count DESC',
        'SELECT d.Name AS Doctor_Name, COUNT(CASE WHEN r.Gender = "Female" THEN 1 END) AS Female_Patient_Count FROM doctors d LEFT JOIN registro r ON d.user = r.Doctor_user GROUP BY d.Name ORDER BY Female_Patient_Count DESC LIMIT 3',
        'SELECT d.Name AS Doctor_Name, COUNT(CASE WHEN r.Gender = "Male" THEN 1 END) AS Male_Patient_Count FROM doctors d LEFT JOIN registro r ON d.user = r.Doctor_user GROUP BY d.Name ORDER BY Male_Patient_Count DESC LIMIT 3',
        'SELECT `Insurance Provider` AS insurance_provider, COUNT(*) AS total_registros FROM registro GROUP BY `Insurance Provider`',
        'SELECT Gender, COUNT(*) AS total_pacientes FROM registro GROUP BY Gender',
        'SELECT Doctor_user, COUNT(DISTINCT id) AS Patients_Assigned FROM registro GROUP BY Doctor_user HAVING COUNT(DISTINCT id) > 3',
        'SELECT SUM(CASE WHEN Age >= 14 AND Age <= 26 THEN 1 ELSE 0 END) AS Juventud, SUM(CASE WHEN Age >= 27 AND Age <= 59 THEN 1 ELSE 0 END) AS Adultez, SUM(CASE WHEN Age >= 60 THEN 1 ELSE 0 END) AS Persona_Mayor FROM registro'
      ];
  
      // Ejecutar todas las consultas concurrentemente usando Promise.all()
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
        total_pacientes: results[0][0].Total_Patients,
        total_medicos: results[1][0].Total_Doctors,
        tipos_de_sangre: results[2],
        recomendaciones_medicacion: results[3],
        medicos_mas_atienden_mujeres: results[4],
        medicos_mas_atienden_hombres: results[5],
        registros_por_seguro: results[6],
        pacientes_por_genero: results[7],
        medicos_con_mas_pacientes_asignados: results[8],
        distribucion_edad_pacientes: results[9][0]
      };
  
      return estadisticas;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error; // Reenviar el error para que el controlador lo maneje
    }
  }
  
// function autenticarMedico(req, res, next) {
//     // Verificar si el token de autenticación está presente en el encabezado de autorización
//     const token = req.headers.authorization;
    
//     if (!token) {
//       return res.status(401).json({ error: 'Token de autenticación no proporcionado' });
//     }
  
//     try {
//       // Verificar y decodificar el token
//       const decoded = jwt.verify(token, 'secreto'); // Reemplaza 'secreto' con tu secreto de token
      
//       // Extraer el ID del médico del token decodificado
//       const doctorId = decoded.doctorId;
      
//       // Verificar si el médico existe en la base de datos
//       connection.query('SELECT * FROM doctors WHERE id = ?', [doctorId], (error, results) => {
//         if (error) {
//           console.error('Error al buscar médico en la base de datos:', error);
//           return res.status(500).json({ error: 'Error al autenticar médico' });
//         }
  
//         if (results.length === 0) {
//           return res.status(401).json({ error: 'Médico no encontrado' });
//         }
  
//         // Adjuntar el ID del médico a la solicitud para que esté disponible en las rutas protegidas
//         req.doctorId = doctorId;
//         next();
//       });
//     } catch (error) {
//       console.error('Error al verificar el token de autenticación:', error);
//       return res.status(401).json({ error: 'Token de autenticación inválido' });
//     }
// }
module.exports = {
  obtenerRegistroPaciente,
  agregarRegistroPaciente,
  editarRegistroPaciente,
  cancelarRegistro,
  obtenerEstadisticas,
  //autenticarMedico,
  //obtenerRegistrosMedico
};
