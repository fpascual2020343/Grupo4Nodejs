const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;

const EmpresaSchema = Schema({

    nombre: String,
    direccion: String, 
    descripcion: String,
    rol: String, 
    sucursales: [{
        nombre: String, 
        direccion: String, 
    }]

})
module.exports = mongoose.model('Empresa', EmpresaSchema)