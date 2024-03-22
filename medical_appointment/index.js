const express = require('express');
const morgan = require('morgan');
const citasController = require('./src/controllers/citasController');

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.use('/', citasController); // Verifica que citasController esté definido y exportado correctamente

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
