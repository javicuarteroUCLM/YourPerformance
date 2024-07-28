//RUTAS GLOBALES
const router = require('express').Router();
const path = require('path');

router.use('/api', require('./api'));

//GET LANDING PAGE
router.get('/', (req, res) => {
    //res.send('Bienvenido a la API de informes sobre rendimiento académico');
    res.sendFile(path.join(__dirname, '../public/index.html'));
});


module.exports = router;

