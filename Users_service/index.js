const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const usuariosController = require('./src/Controllers/userController');

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(bodyParser.json());
app.use('/', usuariosController);

const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
