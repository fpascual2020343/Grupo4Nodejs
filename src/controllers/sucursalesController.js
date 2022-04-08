const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt')
const res = require('express/lib/response');
const Sucursales = require('../models/sucursales.model')


function agregarSucursal(req, res){
 const parametros = req.body; 
 const rolEmpresa = req.user.rol; 
 const modeloSucursal = new Sucursales();



 if(rolEmpresa == 'Empresa'){
    
    modeloSucursal.nombre = parametros.nombre; 
    modeloSucursal.direccion = parametros.direccion; 
    modeloSucursal.idEmpresa = req.user.sub; 


    modeloSucursal.save((err, sucursalGuardada)=>{
        if(err) return res.status(500).send({mensaje: 'Hubo un error en la peticion'})
        if(!sucursalGuardada) return res.status(500).send({mensaje: 'Hubo un error al agregar la sucursal'})
        return res.status(200).send({sucursal: sucursalGuardada})
    })

 }else{
     return res.status(500).send({mensaje: 'Solo las empresas pueden agregar sucursales'})
 }

    


}
function editarSucursal(req, res){
    const parametros = req.body; 
    const rolEmpresa = req.user.rol; 
    const idEmpresaa = req.user.sub;
    const idSucursal = req.params.idSucursal; 

    if(rolEmpresa == 'Empresa'){

        Sucursales.findOne({idEmpresa: idEmpresaa}, (err, sucursalEncontrada)=>{
            if(err) return res.status(500).send({mensaje: 'Hubo un error en la peticion'})
            
            if(sucursalEncontrada){
                Sucursales.findByIdAndUpdate(idSucursal, parametros, {new: true}, (err, sucursalEditada)=>{
                    if(err) return res.status(500).send({mensaje: 'Hubo un error en la peticion'})
                    if(!sucursalEditada) return res.status(500).send({mensaje: 'Hubo un error al editar la sucursal'})
                    return res.status(200).send({sucursal: sucursalEditada})
                    

        
                })
            }else{
                return res.status(500).send({mensaje: 'Solo puede editar las sucursales que son de su empresa'})
            }



        })

        
    }else{
        return res.status(500).send({mensaje: 'Solo las empresas pueden editar sucursales'})

    }
}
function eliminarSucursal(req, res){
const parametros = req.body; 
const idSucursal = req.params.idSucursal; 
const rolEmpresa = req.user.rol; 
const idEmpresaa = req.user.sub;


    Sucursales.findOne({idEmpresa: idEmpresaa}, (err, sucursalEncontrada)=>{
        if(sucursalEncontrada){
            Sucursales.findByIdAndDelete({_id: idSucursal}, (err, sucursalEliminada)=>{


            if(err) return res.status(500).send({mensaje: 'Hubo un error en la peticion'})
            if(!sucursalEliminada) return res.status(500).send({mensaje: 'Hubo un error al la sucursal'})
            return res.status(200).send({sucursal: sucursalEliminada})
        
        })

        }else{
            return res.status(500).send({mensaje: 'No puede eliminar sucurasles de otras empresas'})
        }
    })



}
function obtenerSucursales(req, res){
    const idEmpresa = req.user.sub; 
    const rolEmpresa = req.user.rol;
    if(rolEmpresa == 'Empresa'){
        Sucursales.find({}, (err, sucursalesEncontradas)=>{
            if(err) return res.status(500).send({mensaje: 'Hubo un error en la peticion'})
            if(!sucursalesEncontradas) return res.status(500).send({mensaje: 'Hubo un error al buscar las sucursales'})
            return res.status(200).send({sucursales: sucursalesEncontradas})
        })
    }else{
        return res.status(500).send({mensaje: 'Solo las empressas pueden ver las sucursales que poseen'})
    }


}


function agregarProductos(req, res){
const parametros = req.body;
const idSucursal = req.params.idSucursal; 
const idUsuario = req.user.rol;

if(idUsuario == 'Empresa'){

    Sucursales.findByIdAndUpdate(idSucursal, {$push: {productos:{nombreProducto: parametros.nombre, precioProducto: parametros.precio, stock: parametros.stock} }}, {new: true}, (err, productoAgregado)=>{
    
        if(err) return res.status(500).send({mensaje: 'Hubo un error en la peticion'})
        if(!productoAgregado) return res.status(500).send({mensaje: 'Hubo un error al editar la sucursal'})

        return res.status(200).send({producto: productoAgregado})
    })


}else{


    return res.status(500).send({mensaje: 'Solo la empresa puede agregar productos'})

}


}
function obtenerProductos(req, res){

    var parametros = req.body;
    const idSucursal = req.params.idSucursal;
    Sucursales.aggregate([
        {
            $match: {"_id": mongoose.Types.ObjectId(idSucursal)}
        },
        {
            $unwind: "$productos"
        },
        {
            $match: {  }
        }, 
        {
            $group: {
                "_id": "$_id",
                "nombre": { "$first": "$nombre" },
                "productos": { $push: "$productos" }
            }
        }
    ]).exec((err, productosEncontrados) => {
        return res.status(200).send({ productos: productosEncontrados})
    })
}

module.exports = {
    obtenerSucursales, 
    eliminarSucursal, 
    editarSucursal, 
    agregarSucursal,
    agregarProductos,
    obtenerProductos
}










