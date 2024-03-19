const mysql = require('mysql2/promise');

// Configuración de la conexión a la base de datos MySQL
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'new_schema'
});

// Función para obtener todos los pacientes de la base de datos
async function getAllPacientes() {
  try {
    const [rows] = await pool.query('SELECT * FROM citas');
    return rows;
  } catch (error) {
    console.error('Error al obtener los citas:', error);
    throw error;
  }
}

// Función para obtener un paciente por su ID
async function getPacienteById(id) {
    const result = await pool.query('SELECT * FROM citas WHERE id = ?', [id]);
    return result[0];
}

// Función para crear un nuevo paciente en la base de datos
async function createPaciente(Name,Medical_Condition,medical_appointment_day,Insurance_Provider,Horario,number) {
  try {
    await pool.query('INSERT INTO citas (Name,Medical_Condition,medical_appointment_day,Insurance_Provider,Horario,number) VALUES (?, ?, ?, ?, ?, ?)', [Name,Medical_Condition,medical_appointment_day,Insurance_Provider,Horario,number
    ]);
  } catch (error) {
    console.error('Error al crear el paciente:', error);
    throw error;
  }
}

// Función para actualizar un paciente en la base de datos por su ID
async function updatePacienteById(id, nuevaInformacion) {
  try {
    await pool.query('UPDATE citas SET ? WHERE id = ?', [nuevaInformacion, id]);
  } catch (error) {
    console.error('Error al actualizar el paciente por ID:', error);
    throw error;
  }
}

// Función para borrar un paciente en la base de datos por su ID
async function deletePacienteById(id) {
  try {
    await pool.query('DELETE FROM citas WHERE id = ?', [id]);
  } catch (error) {
    console.error('Error al borrar el la cita por ID:', error);
    throw error;
  }
}

module.exports = { getAllPacientes, getPacienteById, createPaciente, updatePacienteById, deletePacienteById };
