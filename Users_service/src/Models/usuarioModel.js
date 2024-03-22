const mysql = require('mysql');

// Configuración de la conexión a la base de datos MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'clinica'
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
function getUserById(Id, callback) {
    const query = `SELECT * FROM users WHERE id = ?`;

    connection.query(query, [Id], (error, results, fields) => {
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
function updateUser(Id, newData, callback) {
    const { username, password, type } = newData;
    const query = `UPDATE users SET user = ?, password = ?, Name = ?,  type = ? WHERE id = ?`;

    connection.query(query, [user, password, Name, type, Id], (error, results, fields) => {
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
function createUser(user, password, Name, type, callback) {
    const query = `INSERT INTO users (user, password, Name, type) VALUES (?, ?, ?, ?)`;

    connection.query(query, [user,password,Name, type], (error, results, fields) => {
        if (error) {
            console.error('Error al crear usuario:', error);
            return callback(error);
        }
        return callback(null);
    });
}

getUserByEmail: (correo, callback) => {
    const query = 'SELECT * FROM users WHERE user = ?';
    connection.query(query, [correo], (error, results) => {
        if (error) {
            callback(error, null);
        } else {
            callback(null, results);
        }
    });
}

function getAllDoctors(callback) {
    const query = `SELECT * FROM doctors`;

    connection.query(query, (error, results, fields) => {
        if (error) {
            console.error('Error al obtener doctores:', error);
            return callback(error, null);
        }
        return callback(null, results);
    });
}

// Función para obtener un usuario por su ID (solo para administradores)
function getDoctorById(Id, callback) {
    const query = `SELECT * FROM doctors WHERE id = ?`;

    connection.query(query, [Id], (error, results, fields) => {
        if (error) {
            console.error('Error al obtener doctor por ID:', error);
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
function updateDoctor(userId, newData, callback) {
    const { username, password, type } = newData;
    const query = `UPDATE doctors SET username = ?, password = ?, Name = ? WHERE id = ?`;

    connection.query(query, [username, password, type, userId], (error, results, fields) => {
        if (error) {
            console.error('Error al actualizar doctors:', error);
            return callback(error);
        }
        return callback(null);
    });
}

// Función para eliminar un usuario por su ID (solo para administradores)
function deleteDoctor(Id, callback) {
    const query = `DELETE FROM users WHERE id = ?`;

    connection.query(query, [Id], (error, results, fields) => {
        if (error) {
            console.error('Error al eliminar usuario por ID:', error);
            return callback(error);
        }
        return callback(null);
    });
}

// Función para crear un nuevo usuario (solo para administradores)
function createDoctor(user, password, Name, callback) {
    const query = `INSERT INTO users (user, password, Name) VALUES (?, ?, ?)`;

    connection.query(query, [user, password, Name], (error, results, fields) => {
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
    createUser,

    getAllDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor,
    createDoctor,

};
