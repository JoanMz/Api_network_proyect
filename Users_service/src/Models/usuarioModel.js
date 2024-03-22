const mysql = require('mysql');

// Configuración de la conexión a la base de datos MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'clinica',
    port: 3306
});

async function getAllUsers() {
    try {
        const [rows] = await connection.query('SELECT * FROM users');
        return rows;2
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        throw error;
    }
}

// Función para obtener un usuario por su ID (solo para administradores)
async function getUserById(Id) {
    try {
        const [rows] = await connection.query('SELECT * FROM users WHERE id = ?', [Id]);
        return rows[0];
    } catch (error) {
        console.error('Error al obtener usuario por ID:', error);
        throw error;
    }
}

// Función para actualizar un usuario (solo para administradores)
async function updateUser(Id, newData) {
    const { username, password, Name, type } = newData;
    try {
        await connection.query('UPDATE users SET user = ?, password = ?, Name = ?,  type = ? WHERE id = ?', [username, password, Name, type, Id]);
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        throw error;
    }
}

// Función para eliminar un usuario por su ID (solo para administradores)
async function deleteUser(userId) {
    try {
        await connection.query('DELETE FROM users WHERE id = ?', [userId]);
    } catch (error) {
        console.error('Error al eliminar usuario por ID:', error);
        throw error;
    }
}

// Función para crear un nuevo usuario (solo para administradores)
async function createUser(user, password, Name, type) {
    try {
        await connection.query('INSERT INTO users (user, password, Name, type) VALUES (?, ?, ?, ?)', [user, password, Name, type]);
    } catch (error) {
        console.error('Error al crear usuario:', error);
        throw error;
    }
}

// Función para obtener un usuario por su correo electrónico
async function getUserByEmail(correo) {
    try {
        const [rows] = await connection.query('SELECT * FROM users WHERE user = ?', [correo]);
        return rows;
    } catch (error) {
        console.error('Error al obtener usuario por correo electrónico:', error);
        throw error;
    }
}

//Ahora las funciones d ela tabla doctors
//
//

// Función para obtener todos los doctores
async function getAllDoctors() {
    try {
        const [rows] = await pool.query('SELECT * FROM doctors');
        return rows;
    } catch (error) {
        console.error('Error al obtener doctores:', error);
        throw error;
    }
}

// Función para obtener un médico por su ID
async function getDoctorById(id) {
    try {
        const [rows] = await pool.query('SELECT * FROM doctors WHERE id = ?', [id]);
        return rows[0];
    } catch (error) {
        console.error('Error al obtener médico por ID:', error);
        throw error;
    }
}

// Función para actualizar un médico por su ID
async function updateDoctor(id, newData) {
    try {
        await pool.query('UPDATE doctors SET ? WHERE id = ?', [newData, id]);
    } catch (error) {
        console.error('Error al actualizar médico por ID:', error);
        throw error;
    }
}

// Función para eliminar un médico por su ID
async function deleteDoctor(id) {
    try {
        await pool.query('DELETE FROM doctors WHERE id = ?', [id]);
    } catch (error) {
        console.error('Error al eliminar médico por ID:', error);
        throw error;
    }
}

// Función para crear un nuevo médico
async function createDoctor(username, password, Name) {
    try {
        await pool.query('INSERT INTO doctors (username, password, Name) VALUES (?, ?, ?)', [username, password, Name]);
    } catch (error) {
        console.error('Error al crear médico:', error);
        throw error;
    }
}


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
    createDoctor

};
