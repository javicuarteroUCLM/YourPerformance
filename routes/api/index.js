const router = require('express').Router();

router.use('/rendimientos', require('./rendimientos.route'));

module.exports = router;

