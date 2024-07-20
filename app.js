const express = require('express');

const app = express();

//Configuracion de Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req,res) => {
    res.send('Hola, esto es una prueba');
});


module.exports = app;