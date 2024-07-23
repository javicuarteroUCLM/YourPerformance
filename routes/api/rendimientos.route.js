const router = require('express').Router();

const Rendimiento = require('../../models/performance.model');

router.get('/', async (req, res) => {
    try {
        const rendimientos = await Rendimiento.find();
        res.json(rendimientos);
    } catch (error) {
        res.status(500).json({ error: 'Ha ocurrido un error' });
        
    }
});

router.post('/', async (req, res) => {
    try {
        const newRendimiento = await Rendimiento.create(req.body);
        res.json(newRendimiento);

    } catch (error) {
        res.status(500).json({ error: 'Ha ocurrido un error' });
    }
});

module.exports = router;