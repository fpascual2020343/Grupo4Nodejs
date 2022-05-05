const express = require('express');
const empresaControlador = require('../controllers/empresaController');
const md_autenticacion = require('../middlewares/autenticacion');
const api = express.Router();

api.post('/agregarEmpresa',md_autenticacion.Auth ,empresaControlador.agregarEmpresa);// Agregar empresas
api.put('/editarEmpresa/:idEmpresa', md_autenticacion.Auth, empresaControlador.editarEmpresa);//editar empresas
api.get('/obtenerEmpresas', md_autenticacion.Auth,empresaControlador.obtenerEmpresas);//obtener empresas
api.delete('/eliminarEmpresa/:idEmpresa', md_autenticacion.Auth, empresaControlador.eliminarEmpresa); //eliminar empresas
api.put('/agregarProductosEmpresa',md_autenticacion.Auth, empresaControlador.agregarProductos)
api.put('/editarProductosEmpresa/:idProducto', md_autenticacion.Auth, empresaControlador.editarProductos)
api.get('/obtenerProductosEmpresa', md_autenticacion.Auth, empresaControlador.obtenerProductos)
api.delete('/eliminarProductosEmpresa/:idProducto', md_autenticacion.Auth, empresaControlador.eliminarProductos)
api.get('/obtenerProductoEmpresa/:idProducto', md_autenticacion.Auth, empresaControlador.obtenerProducto)
api.put('/agregarProductosSucursal/:idSucursal/:idProducto', md_autenticacion.Auth, empresaControlador.agregarProductosSucursal);//agregar productos



module.exports = api;