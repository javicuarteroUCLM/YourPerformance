const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const path = require('path');

const app = express();

mongoose.connect('mongodb://127.0.0.1/rendimientos', {
    useNewUrlParser: true, 
    useUnifiedTopology: true
})
.then(() => console.log('Conectado a la base de datos'))
.catch((error) => console.log('Error al conectar a la base de datos', error));

//Configuracion de Express
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

//Para .css e imágenes (estaticos)
app.use(express.static(path.join(__dirname, './public')));

//Rutas
app.use('/',require('./routes/index'));
app.use('/api', require('./routes/api/index'));

//Manejo de errores
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
  });

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});


module.exports = app;