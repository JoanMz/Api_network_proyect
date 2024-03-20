const mysql = require('mysql2/promise');

// Configuración de la conexión a la base de datos MySQL
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'clinica',
  port: 3306,
});

// Función para obtener todos los Citass de la base de datos
async function getAllCitas() {
  try {
    const [rows] = await pool.query('SELECT * FROM citas');
    return rows;
  } catch (error) {
    console.error('Error al obtener los citas:', error);
    throw error;
  }
}

// Función para obtener un Citas por su ID
async function getCitasById(id) {
    const result = await pool.query('SELECT * FROM citas WHERE id = ?', [id]);
    return result[0];
}

// Función para crear un nuevo Citas en la base de datos
async function createCitas(Name, Medical_Condition, medical_appointment_day, Insurance_Provider, Horario, number) {
  try {
    await pool.query('INSERT INTO citas ("Name","Medical Condition","medical appointment day","Insurance Provider", "Horario", "number") VALUES (?, ?, ?, ?, ?, ?)', 
    [Name,Medical_Condition,medical_appointment_day,Insurance_Provider,Horario,number]);
  } catch (error) {
    console.error('Error al crear el Citas:', error);
    throw error;
  }
}

// Función para actualizar un Citas en la base de datos por su ID
async function updateCitasById(id, nuevaInformacion) {
  try {
    await pool.query('UPDATE citas SET ? WHERE id = ?', [nuevaInformacion, id]);
  } catch (error) {
    console.error('Error al actualizar el Citas por ID:', error);
    throw error;
  }
}

// Función para borrar un Citas en la base de datos por su ID
async function deleteCitasById(id) {
  try {
    await pool.query('DELETE FROM citas WHERE id = ?', [id]);
  } catch (error) {
    console.error('Error al borrar el la cita por ID:', error);
    throw error;
  }
}

module.exports = {getCitasById, createCitas, updateCitasById, deleteCitasById, getAllCitas};
