const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt')
const res = require('express/lib/response');
const Empresa = require('../models/empresa.model')
const Usuario = require('../models/usuario.model')
const Sucursales = require('../models/sucursales.model')


function agregarEmpresa(req, res){
    const parametros = req.body; 
    const modeloEmpresa = new Empresa();

    if(req.user.rol == 'Administrador'){
        bcrypt.hash(parametros.password, null, null, (err, passwordEncryptada) => {


            modeloEmpresa.nombre = parametros.nombre;
            modeloEmpresa.direccion = parametros.direccion; 
            modeloEmpresa.descripcion = parametros.descripcion; 
            modeloEmpresa.rol = 'Empresa';    
        
                modeloEmpresa.password = passwordEncryptada
                modeloEmpresa.save((err, empresaGuardada)=>{
                    if(err) return res.status(500).send({mensaje: 'Hubo un error en la peticion'})
                    if(!empresaGuardada) return res.status(500).send({mensaje: 'Hubo un error al agregar la empresa'})
            
                    return res.status(200).send({empresa: empresaGuardada})
                })
            })
            
            
        
        
           


    }else{
        return res.status(500).send({mensaje: 'Solo los administradores pueden agregar las empresas'})
    }

    

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
    rol = req.user.rol;

    if(rol == 'Administrador'){

            Empresa.find({}, (err, empresaEncontradas)=>{
                if(err) return res.status(500).send({mensaje: 'Hubo un error en la peticion'})
                if(!empresaEncontradas) return res.status(500).send({mensaje: 'Hubo un error al obtener las empresas'})
    
                return res.status(200).send({empresa: empresaEncontradas})
            })
    


        }else{
            Empresa.find({_id: req.user.sub}, (err, empresaEncontradas)=>{
                if(err) return res.status(500).send({mensaje: 'Hubo un error en la peticion'})
                if(!empresaEncontradas) return res.status(500).send({mensaje: 'Hubo un error al obtener las empresas'})
    
                return res.status(200).send({empresa: empresaEncontradas})
            })
            }

      
  
}
function agregarProductos(req, res){
    const parametros = req.body;
    const idEmpresa = req.user.sub;

    if(req.user.rol == 'Empresa'){
        Empresa.findByIdAndUpdate(idEmpresa, {$push: {productos: {nombreProducto: parametros.nombreProducto, precioProducto: parametros.precioProducto, stock: parametros.stock}}},{new:true},(err, productoAgregado)=>{
            if(err) return res.status(500).send({mensaje: 'Hubo un error en la peticion'})
            if(!productoAgregado) return res.status(500).send({mensaje: 'Hubo un error al agregar el producto'})

            return res.status(200).send({productos: productoAgregado})
        })


    }

}
function editarProductos(req, res){
const parametros = req.body; 
const idProducto = req.params.idProducto;

if(req.user.rol == 'Empresa'){
    Empresa.updateOne({"productos._id": idProducto}, {$set : {"productos.$.nombreProducto": parametros.nombreProducto, "productos.$.precioProducto": parametros.precioProducto, "productos.$.stock": parametros.stock}}, {new: true}, (err, productosActualizados)=>{

        if(err) return res.status(500).send({mensaje: 'Hubo un error en la peticion'})
        if(!productosActualizados) return res.status(500).send({mensaje: 'Hubo un error al editar el producto'})

        return res.status(200).send({producto: productosActualizados})

    })
}


}
function obtenerProductos(req, res){
    const idEmpresa = req.user.sub;

    if(req.user.rol == 'Empresa'){

      
        Empresa.aggregate([
            {
                $match: {"_id": mongoose.Types.ObjectId(idEmpresa)  }
            },
            {
                $unwind: "$productos"
            },
            {
                $match: {}
            }, 
            {
                $group: {
                    "_id": "$_id",
                    "nombre": { "$first": "$nombre" },
                    "productos": { $push: "$productos" }
                }
            }
        ]).exec((err, productosEncontrados) => {
            if(err) return res.status(400).send({mensaje: 'Hubo un error en la peticion'})
            if(!productosEncontrados) return res.status(500).send({mensaje: 'Hubo un error al obtener los productos'})

            return res.status(200).send({ productos: productosEncontrados[0].productos})

        })

    }else{
        return res.status(500).send({mensaje: 'Solo las empresas pueden ver sus productos'})
    }


        

}

function eliminarProductos(req, res){

    const idProducto = req.params.idProducto;
    Empresa.updateMany({_id: req.user.sub}, {$pull :{productos:{_id: idProducto}}}, (err, productoEliminado) =>{
        if(err) return res.status(500).send({mensaje: 'Hubo un error en la peticion'})
        if(!productoEliminado) return res.status(500).send({mensaje: 'Hubo un error al eliminar el producto'})

        return res.status(200).send({carrito: productoEliminado})
    })
}
function obtenerProducto(req, res){
    const idProducto = req.params.idProducto;
    const idEmpresa = req.user.sub

    if(req.user.rol == 'Empresa'){

      
        Empresa.aggregate([
            {
                $match: {"_id": mongoose.Types.ObjectId(idEmpresa)  }
            },
            {
                $unwind: "$productos"
            },
            {
                $match: {"productos._id": mongoose.Types.ObjectId(idProducto)}
            }, 
            {
                $group: {
                    "_id": "$_id",
                    "nombre": { "$first": "$nombre" },
                    "productos": { $push: "$productos" }
                }
            }
        ]).exec((err, productosEncontrados) => {
            if(err) return res.status(400).send({mensaje: 'Hubo un error en la peticion'})
            if(!productosEncontrados) return res.status(500).send({mensaje: 'Hubo un error al obtener los productos'})

            return res.status(200).send({ productos: productosEncontrados[0].productos[0]})

        })

    }else{
        return res.status(500).send({mensaje: 'Solo las empresas pueden ver sus productos'})
    }

}

function agregarProductosSucursal(req, res){
    const parametros = req.body;
    const idSucursal = req.params.idSucursal; 
    const idUsuario = req.user.rol;
    const idProducto = req.params.idProducto;
    if(idUsuario == 'Empresa'){
    
        Sucursales.findByIdAndUpdate(idSucursal, {$push: {productos:{nombreProducto: parametros.nombreProducto, precioProducto: parametros.precioProducto, stock: parametros.stock} }}, {new: true}, (err, productoAgregado)=>{
        
            Empresa.updateOne({"productos._id": idProducto},{$inc: {"productos.$.stock": -parametros.stock}},{new: true}, (err, empresaActualizada)=>{
                if(err) return res.status(500).send({mensaje: 'Hubo un error en la peticion'})
                if(!empresaActualizada) return res.status(500).send({mensaje: 'Hubo un error al editar el stock de la empresa'})
            })
            
            
            if(err) return res.status(500).send({mensaje: 'Hubo un error en la peticion'})
            if(!productoAgregado) return res.status(500).send({mensaje: 'Hubo un error al editar la sucursal'})
            return res.status(200).send({producto: productoAgregado})
        })
    
    
    }else{
    
    
        return res.status(500).send({mensaje: 'Solo la empresa puede agregar productos'})
    
    }
    
    
    }


module.exports = {
    agregarProductosSucursal,
    agregarEmpresa,
    editarEmpresa,
    eliminarEmpresa,
    obtenerEmpresas,
    agregarProductos,
    editarProductos, 
    obtenerProductos,
    eliminarProductos,
    obtenerProducto
     
}