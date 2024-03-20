const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'new_schema'
});

async function getAllUsuarios() {
  const [rows] = await pool.query('SELECT * FROM usuarios');
  return rows;
}

async function getUsuarioById(id) {
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);
  return rows[0];
}

async function createUsuario(usuario) {
  const { nombre, correo, contraseña } = usuario;
  await pool.query('INSERT INTO usuarios (nombre, correo, contraseña) VALUES (?, ?, ?)', [nombre, correo, contraseña]);
}

async function updateUsuarioById(id, usuario) {
  const { nombre, correo, contraseña } = usuario;
  await pool.query('UPDATE usuarios SET nombre = ?, correo = ?, contraseña = ? WHERE id = ?', [nombre, correo, contraseña, id]);
}

async function deleteUsuarioById(id) {
  await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
}

module.exports = {
  getAllUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuarioById,
  deleteUsuarioById
};
