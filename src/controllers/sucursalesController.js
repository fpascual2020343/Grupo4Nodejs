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
    const idSucursal = req.params.idSucursal; 
    const idEmpresaa = req.user.sub;

        Sucursales.find({idEmpresa: idEmpresaa}, (err, sucursalesEncontradas)=>{
            if(err) return res.status(500).send({mensaje: 'Hubo un error en la peticion'})
            if(!sucursalesEncontradas) return res.status(500).send({mensaje: 'Hubo un error al buscar las sucursales'})
            return res.status(200).send({sucursales: sucursalesEncontradas})
        })
    

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
function ObtenerSucursalId (req, res) {
    const idSucursal = req.params.idSucursal;

    Sucursales.findById(idSucursal, (err, sucursalEncontrada)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if(!sucursalEncontrada) return res.status(500).send({ mensaje: 'Error al obtener el Producto'});

        return res.status(200).send({ sucursal: sucursalEncontrada })
    })
}

module.exports = {
    obtenerSucursales, 
    eliminarSucursal, 
    editarSucursal, 
    agregarSucursal,
    obtenerProductos,
    ObtenerSucursalId
}










