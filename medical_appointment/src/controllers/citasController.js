const { Router } = require('express');
const router = Router();
const citasModel = require('../models/citasModel');

// Obtener todas las citas
router.get('/citas', async (req, res) => {
    const citas = await citasModel.getAllCitas();
    res.json(citas);
});

// Obtener una cita por su ID
router.get('/citas/:id', async (req, res) => {
    const id = req.params.id;
    const cita = await citasModel.getCitasById(id);
    res.json(cita);
});

// Actualizar una cita por su ID
router.put('/citas/:id', async (req, res) => {
    const id = req.params.id;
    const nuevaInfoCita = req.body;
    await citasModel.updateCitasById(id, nuevaInfoCita);
    res.send('Cita actualizada correctamente');
});

// Crear una nueva cita
router.post('/citas', async (req, res) => {
    const nuevaCita = req.body;
    await citasModel.createCitas(nuevaCita);
    res.send('Cita creada correctamente');
});

// Borrar una cita por su ID
router.delete('/citas/:id', async (req, res) => {
    const id = req.params.id;
    await citasModel.deleteCitaById(id);
    res.send('Cita eliminada correctamente');
});

module.exports = router;
