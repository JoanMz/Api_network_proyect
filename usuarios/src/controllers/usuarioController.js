const { Router } = require('express');
const router = Router();
const usuarioModel = require('../models/usuarioModel');

router.get('/usuarios', async (req, res) => {
  const usuarios = await usuarioModel.getAllUsuarios();
  res.json(usuarios);
});

router.get('/usuarios/:id', async (req, res) => {
  const id = req.params.id;
  const usuario = await usuarioModel.getUsuarioById(id);
  res.json(usuario);
});

router.post('/usuarios', async (req, res) => {
  const nuevoUsuario = req.body;
  await usuarioModel.createUsuario(nuevoUsuario);
  res.send('Usuario creado correctamente');
});

router.put('/usuarios/:id', async (req, res) => {
  const id = req.params.id;
  const nuevoUsuario = req.body;
  await usuarioModel.updateUsuarioById(id, nuevoUsuario);
  res.send('Usuario actualizado correctamente');
});

router.delete('/usuarios/:id', async (req, res) => {
  const id = req.params.id;
  await usuarioModel.deleteUsuarioById(id);
  res.send('Usuario eliminado correctamente');
});

module.exports = router;
