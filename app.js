<<<<<<< HEAD

=======
>>>>>>> Daniel
const express = require('express');
const cors = require('cors');
var app = express();

const UsuarioRutas = require('./src/routes/usuario.routes');
<<<<<<< HEAD
=======
const EmpresaRutas = require('./src/routes/empresa.routes');
>>>>>>> Daniel

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors());

<<<<<<< HEAD
app.use('/api', UsuarioRutas);
=======
app.use('/api', UsuarioRutas, EmpresaRutas);
>>>>>>> Daniel


module.exports = app;