const express = require('express');
const usuarioControlador = require('../controllers/usuario.controller');
const md_autenticacion = require('../middlewares/autenticacion');

const api = express.Router();

api.post('/login', usuarioControlador.Login);// Login de Administrador y de Clientes
api.post('/registro', usuarioControlador.Registro);// registrar empresas

module.exports = api;