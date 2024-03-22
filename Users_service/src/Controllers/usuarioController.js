const express = require('express');
const router = express.Router();
const userModel = require('../models/userModel');

router.get('/users', async (req, res) => {
    const users = await userModel.getAllUsers();
    res.json(users);
});

router.get('/users/:id', async (req, res) => {
    const userId = req.params.id;
    const user = await userModel.getUserById(userId);
    res.json(user);
});

router.put('/users/:id', async (req, res) => {
    const userId = req.params.id;
    const newData = req.body;
    await userModel.updateUser(userId, newData);
    res.json({ message: 'Usuario actualizado correctamente' });
});

router.delete('/users/:id', async (req, res) => {
    const userId = req.params.id;
    await userModel.deleteUser(userId);
    res.json({ message: 'Usuario eliminado correctamente' });
});

router.post('/users', async (req, res) => {
    const { username, password, type } = req.body;
    await userModel.createUser(username, password, type);
    res.json({ message: 'Usuario creado correctamente' });
});


// Ahora las funciones de la tabla doctors
//
//

router.get('/doctors', async (req, res) => {
    const doctors = await userModel.getAllDoctors();
    res.json(doctors);
});

router.get('/doctors/:id', async (req, res) => {
    const doctorId = req.params.id;
    const doctor = await userModel.getDoctorById(doctorId);
    if (!doctor) {
        return res.status(404).json({ message: 'Doctor no encontrado' });
    }
    res.json(doctor);
});

router.put('/doctors/:id', async (req, res) => {
    const doctorId = req.params.id;
    const newData = req.body;
    await userModel.updateDoctor(doctorId, newData);
    res.json({ message: 'Doctor actualizado correctamente' });
});

router.delete('/doctors/:id', async (req, res) => {
    const doctorId = req.params.id;
    await userModel.deleteDoctor(doctorId);
    res.json({ message: 'Doctor eliminado correctamente' });
});

router.post('/doctors', async (req, res) => {
    const { username, password, type } = req.body;
    await userModel.createDoctor(username, password, type);
    res.json({ message: 'Doctor creado correctamente' });
});

module.exports = router;