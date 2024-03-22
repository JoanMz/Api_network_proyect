const { Router } = require('express');
const router = Router();
const userModel = require('../models/userModel');

router.get('/users', async (req, res) => {
    userModel.getAllUsers((error, users) => {
        if (error) {
            console.error('Error al obtener usuarios:', error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
        res.status(200).json(users);
    });
});

router.get('/users/:id', async (req, res) => {
    const userId = req.params.id;

    userModel.getUserById(userId, (error, user) => {
        if (error) {
            console.error('Error al obtener usuario por ID:', error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json(user);
    });
});

router.put('/users/:id', async (req, res) => {
    const userId = req.params.id;
    const newData = req.body;

    userModel.updateUser(userId, newData, (error) => {
        if (error) {
            console.error('Error al actualizar usuario:', error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
        res.status(200).json({ message: 'Usuario actualizado correctamente' });
    });
});

router.delete('/users/:id', async (req, res) => {
    const userId = req.params.id;

    userModel.deleteUser(userId, (error) => {
        if (error) {
            console.error('Error al eliminar usuario por ID:', error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
        res.status(200).json({ message: 'Usuario eliminado correctamente' });
    });
});

router.post('/users', async (req, res) => {
    const { username, password, type } = req.body;

    userModel.createUser(username, password, type, (error) => {
        if (error) {
            console.error('Error al crear usuario:', error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
        res.status(200).json({ message: 'Usuario creado correctamente' });
    });
});

module.exports = router;
