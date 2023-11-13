const mongoose = require('mongoose');
const { Schema } = mongoose;

const NoteSchema = new Schema({
    nombre:{ type: String, required: true},
    puesto:{ type: String, required: true},
    salario:{ type: String, required: true},
    seguimiento:{ type: String, required: true },
    gafette:{ type: String, required: true },
    date:{type: Date, default: Date.now}
});

module.exports = mongoose.model('Note', NoteSchema, 'reclutamiento');
