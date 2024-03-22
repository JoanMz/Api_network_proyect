const mysql = require('mysql');

// Configuración de la conexión a la base de datos MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'nombre_base_de_datos'
});



// Función para obtener todos los usuarios (solo para administradores)
function getAllUsers(callback) {
    const query = `SELECT * FROM users`;

    connection.query(query, (error, results, fields) => {
        if (error) {
            console.error('Error al obtener usuarios:', error);
            return callback(error, null);
        }
        return callback(null, results);
    });
}

// Función para obtener un usuario por su ID (solo para administradores)
function getUserById(userId, callback) {
    const query = `SELECT * FROM users WHERE id = ?`;

    connection.query(query, [userId], (error, results, fields) => {
        if (error) {
            console.error('Error al obtener usuario por ID:', error);
            return callback(error, null);
        }
        if (results.length === 1) {
            return callback(null, results[0]);
        } else {
            return callback(null, null);
        }
    });
}

// Función para actualizar un usuario (solo para administradores)
function updateUser(userId, newData, callback) {
    const { username, password, type } = newData;
    const query = `UPDATE users SET username = ?, password = ?, type = ? WHERE id = ?`;

    connection.query(query, [username, password, type, userId], (error, results, fields) => {
        if (error) {
            console.error('Error al actualizar usuario:', error);
            return callback(error);
        }
        return callback(null);
    });
}

// Función para eliminar un usuario por su ID (solo para administradores)
function deleteUser(userId, callback) {
    const query = `DELETE FROM users WHERE id = ?`;

    connection.query(query, [userId], (error, results, fields) => {
        if (error) {
            console.error('Error al eliminar usuario por ID:', error);
            return callback(error);
        }
        return callback(null);
    });
}

// Función para crear un nuevo usuario (solo para administradores)
function createUser(username, password, type, callback) {
    const query = `INSERT INTO users (username, password, type) VALUES (?, ?, ?)`;

    connection.query(query, [username, password, type], (error, results, fields) => {
        if (error) {
            console.error('Error al crear usuario:', error);
            return callback(error);
        }
        return callback(null);
    });
}

getUserByEmail: (correo, callback) => {
    const query = 'SELECT * FROM users WHERE correo = ?';
    connection.query(query, [correo], (error, results) => {
        if (error) {
            callback(error, null);
        } else {
            callback(null, results);
        }
    });
}

function getAllUsers(callback) {
    const query = `SELECT * FROM users`;

    connection.query(query, (error, results, fields) => {
        if (error) {
            console.error('Error al obtener usuarios:', error);
            return callback(error, null);
        }
        return callback(null, results);
    });
}

// Función para obtener un usuario por su ID (solo para administradores)
function getUserById(userId, callback) {
    const query = `SELECT * FROM users WHERE id = ?`;

    connection.query(query, [userId], (error, results, fields) => {
        if (error) {
            console.error('Error al obtener usuario por ID:', error);
            return callback(error, null);
        }
        if (results.length === 1) {
            return callback(null, results[0]);
        } else {
            return callback(null, null);
        }
    });
}

// Función para actualizar un usuario (solo para administradores)
function updateUser(userId, newData, callback) {
    const { username, password, type } = newData;
    const query = `UPDATE users SET username = ?, password = ?, type = ? WHERE id = ?`;

    connection.query(query, [username, password, type, userId], (error, results, fields) => {
        if (error) {
            console.error('Error al actualizar usuario:', error);
            return callback(error);
        }
        return callback(null);
    });
}

// Función para eliminar un usuario por su ID (solo para administradores)
function deleteUser(userId, callback) {
    const query = `DELETE FROM users WHERE id = ?`;

    connection.query(query, [userId], (error, results, fields) => {
        if (error) {
            console.error('Error al eliminar usuario por ID:', error);
            return callback(error);
        }
        return callback(null);
    });
}

// Función para crear un nuevo usuario (solo para administradores)
function createUser(username, password, type, callback) {
    const query = `INSERT INTO users (username, password, type) VALUES (?, ?, ?)`;

    connection.query(query, [username, password, type], (error, results, fields) => {
        if (error) {
            console.error('Error al crear usuario:', error);
            return callback(error);
        }
        return callback(null);
    });
}
module.exports = UserModel;
module.exports = {
    getAllUsers,
    getUserById,
    getUserByEmail,
    updateUser,
    deleteUser,
    createUser
};
