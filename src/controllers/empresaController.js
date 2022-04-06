const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt')
const res = require('express/lib/response');
const Empresa = require('../models/empresa.model')
const Usuario = require('../models/usuario.model')

function agregarEmpresa(req, res){
    const parametros = req.body; 
    const modeloEmpresa = new Empresa();
    const modeloUsuario = new Usuario();


    modeloEmpresa.nombre = parametros.nombre;
    modeloEmpresa.direccion = parametros.direccion; 
    modeloEmpresa.descripcion = parametros.descripcion; 
    modeloEmpresa.rol = 'Empresa';   
    bcrypt.hash(modeloEmpresa.password, null, null, (err, passwordEncryptada) => {
        modeloEmpresa.password = passwordEncryptada
        modeloEmpresa.save((err, empresaGuardada)=>{
            if(err) return res.status(500).send({mensaje: 'Hubo un error en la peticion'})
            if(!empresaGuardada) return res.status(500).send({mensaje: 'Hubo un error al agregar la empresa'})
    
            return res.status(200).send({empresa: empresaGuardada})
        })
    })
    
    


   

}
function editarEmpresa(req, res){
    const parametros = req.body; 
    const idEmpresa = req.params.idEmpresa;
    if(req.user.rol = 'Administrador'){

        Empresa.findByIdAndUpdate(idEmpresa, parametros, {new: true}, (err, empresaActualizada)=>{
            if(err) return res.status(500).send({mensaje: 'Hubo en la peticion'});
            if(!empresaActualizada) res.status(500).send({mensaje: 'Hubo un error al actualizar la empresa'})

            return res.status(200).send({empresa: empresaActualizada})
        })

    }else{
        return res.status(500).send({mensaje: 'Solo los admnistradores pueden editar las empresas'})
    }
}

function eliminarEmpresa(req, res){
    const idEmpresa = req.params.idEmpresa; 

    if(req.user.rol == 'Administrador'){
        Empresa.findByIdAndDelete({_id: idEmpresa}, (err, empresaEliminada)=>{
            if(err) return res.status(500).send({mensaje: 'Hubo un error en la peticion'});
            if(!empresaEliminada) return res.status(500).send({mensaje: 'Hubo un error al eliminar la empresa'}); 
    
            return res.status(200).send({empresa: empresaEliminada})
        })
    }else{
        return res.status(500).send({mensaje: 'Solo los administradores pueden eliminar las empresas'})
    }

}
function obtenerEmpresas(req, res){


        Empresa.find({}, (err, empresaEncontradas)=>{
            if(err) return res.status(500).send({mensaje: 'Hubo un error en la peticion'})
            if(!empresaEncontradas) return res.status(500).send({mensaje: 'Hubo un error al obtener las empresas'})

            return res.status(200).send({empresa: empresaEncontradas})
        })

  
}

function agregarSucursales(req, res){
    const parametros = req.body;
    const idEmpresa = req.params.idEmpresa; 
    const idUsuario = req.user.rol;

    if(idUsuario == 'Empresa'){

        Empresa.findByIdAndUpdate(idEmpresa, {$push: {sucursales:{nombre: parametros.nombre, direccion: parametros.direccion, productos: []} }}, {new: true}, (err, sucursalAgregada)=>{
        
            if(err) return res.status(500).send({mensaje: 'Hubo un error en la peticion'})
            if(!sucursalAgregada) return res.status(500).send({mensaje: 'Hubo un error al editar la sucursal'})

            return res.status(200).send({sucursal: sucursalAgregada})
        })

        


    }else{


        return res.status(500).send({mensaje: 'Solo la empresa puede agregar sucursales'})
    
    }


}
function editarSucursal(req, res){
const parametros = req.body;
const idUsuario = req.user.rol;
const idSucursal = req.params.idSucursal;

if(idUsuario == 'Empresa'){

    Empresa.updateOne({"sucursales._id": idSucursal}, {$set: {"sucursales.$.nombre": parametros.nombre, "sucursales.$.direccion": parametros.direccion}}, {new: true}, (err, sucursalActualizada)=>{
        if(err) return res.status(500).send({mensaje: 'Hubo un error en la peticion'})
        if(!sucursalActualizada) return res.status(500).send({mensaje: 'Hubo un error en la peticion'})

        return res.status(200).send({sucursal: sucursalActualizada})
    })


}else{


    return res.status(500).send({mensaje: 'Solo la empresa puede editar sucursales'})

}



}
function eliminarSucursales(req, res){

const idEmpresa = req.user.sub;
const idSucursal = req.params.idSucursal;

if(req.user.rol == 'Empresa'){
    Empresa.updateMany({_id: req.user.sub}, {$pull: {sucursales: {_id: idSucursal}}},(err, sucursalEliminada)=>{
        if(err) return res.status(500).send({mensaje: 'Hubo un error en la peticion'})
        if(!sucursalEliminada) return res.status(500).send({mensaje: 'Hubo un error en la peticion'})
        console.log(req.user.sub, idSucursal);
        return res.status(200).send({sucursal: sucursalEliminada})
    })
}else{


    return res.status(500).send({mensaje: 'Solo la empresa puede eliminar sucursales'})

}

    


}
function obtenerSucursales(req, res){

    var parametros = req.body;

    Empresa.aggregate([
        {
            $match: {}
        },
        {
            $unwind: "$sucursales"
        },
        {
            $match: {  }
        }, 
        {
            $group: {
                "_id": "$_id",
                "nombre": { "$first": "$nombre" },
                "sucursales": { $push: "$sucursales" }
            }
        }
    ]).exec((err, sucursalesEncontradas) => {
        return res.status(200).send({ sucursales: sucursalesEncontradas})
    })
}
module.exports = {
    agregarSucursales,
    agregarEmpresa,
    editarEmpresa,
    eliminarEmpresa,
    obtenerEmpresas,
    obtenerSucursales, 
    eliminarSucursales, 
    editarSucursal 
}