const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const asignaturaSchema = new Schema( {
    nota: {type: Number, required: true},
});
 
const yearSchema = new Schema({
    year: {type: Number, required: true},
    asignaturas: [asignaturaSchema]
});

const rendimientoSchema = new Schema({
    years: [yearSchema]
});

module.exports = mongoose.model('Rendimiento', rendimientoSchema);