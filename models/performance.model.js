const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const asignaturaSchema = new Schema( {
    nota: {type: Number, required: true},
});
 
const yearSchema = new Schema({
    year: { type: Number, required: true },
    asignaturas: {
        type: [asignaturaSchema],
        validate: {
            validator: function(v) {
                return v && v.length > 0;
            },
            message: 'Cada año debe tener al menos una asignatura.'
        },
        required: true
    }
});

const rendimientoSchema = new Schema({
    years: {
        type: [yearSchema],
        validate: {
            validator: function(v) {
                return v && v.length > 0;
            },
            message: 'Debe haber al menos un año con asignaturas.'
        },
        required: true
    },
    name: { type: String, required: false }
});

module.exports = mongoose.model('Rendimiento', rendimientoSchema);