const express = require('express');
const empresaControlador = require('../controllers/empresaController');
const md_autenticacion = require('../middlewares/autenticacion');
const api = express.Router();

api.post('/agregarEmpresa', empresaControlador.agregarEmpresa);// Agregar empresas
api.put('/editarEmpresa/:idEmpresa', md_autenticacion.Auth, empresaControlador.editarEmpresa);//editar empresas
api.get('/obtenerEmpresas', empresaControlador.obtenerEmpresas);//obtener empresas
api.delete('/eliminarEmpresa/:idEmpresa', md_autenticacion.Auth, empresaControlador.eliminarEmpresa); //eliminar empresas

module.exports = api;