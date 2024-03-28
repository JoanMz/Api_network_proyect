// const mysql = require('mysql2/promise');

// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: 'password',
//   database: 'new_schema',
//   port: 3306
// });

const mysql = require('mysql');
const config = require('./config')
// Configuración de conexión a MySQL
const connection = mysql.createConnection(config.dbConfig);
// Definición del modelo de usuario
class User {
  static findOneByEmail(user, tableName, callback) { // Agrega tableName como segundo parámetro
    connection.query(`SELECT * FROM ${tableName} WHERE user = ?`, [user], (error, results) => {
      if (error) throw error;
      callback(results[0]);
    });
  }
}

module.exports = User;


// async function getAllUsuarios() {
//   const [rows] = await pool.query('SELECT * FROM usuarios');
//   return rows;
// }

// async function getUsuarioById(id) {
//   const [rows] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);
//   return rows[0];
// }

// async function createUsuario(usuario) {
//   const { username, email, password } = usuario;
//   await pool.query('INSERT INTO usuarios (username, email, password) VALUES (?, ?, ?)', [username, email, password]);
// }

// async function updateUsuarioById(id, usuario) {
//   const { username, email, password } = usuario;
//   await pool.query('UPDATE usuarios SET username = ?, email = ?, password = ? WHERE id = ?', [username, email, password, id]);
// }

// async function deleteUsuarioById(id) {
//   await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
// }

// module.exports = {
//   getAllUsuarios,
//   getUsuarioById,
//   createUsuario,
//   updateUsuarioById,
//   deleteUsuarioById
// };
