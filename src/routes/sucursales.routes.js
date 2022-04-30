const express = require('express');
const sucursalesControlador = require('../controllers/sucursalesController');
const md_autenticacion = require('../middlewares/autenticacion');
const api = express.Router();


api.post('/agregarSucursal', md_autenticacion.Auth, sucursalesControlador.agregarSucursal);// Agregar sucursal
api.put('/editarSucursal/:idSucursal', md_autenticacion.Auth, sucursalesControlador.editarSucursal);//editar sucursal
api.get('/obtenerSucursales', md_autenticacion.Auth,sucursalesControlador.obtenerSucursales);//obtener sucursales
api.delete('/eliminarSucursales/:idSucursal', md_autenticacion.Auth, sucursalesControlador.eliminarSucursal); //eliminar sucursales
api.get('/obtenerProductos/:idSucursal', md_autenticacion.Auth, sucursalesControlador.obtenerProductos);//obtener productos
api.get('/obtenerSucursal/:idSucursal', md_autenticacion.Auth,sucursalesControlador.ObtenerSucursalId);//obtener sucursales
api.put('/generarVenta/:idProducto/:idSucursal', md_autenticacion.Auth, sucursalesControlador.generarVenta)
api.get('/obtenerProdid/:idProducto/:idSucursal', md_autenticacion.Auth, sucursalesControlador.obtenerProductoId)

module.exports = api;