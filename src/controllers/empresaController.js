const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt')
const res = require('express/lib/response');
const Empresa = require('../models/empresa.model')

function agregarEmpresa(req, res) {
    const parametros = req.body;
    const modeloEmpresa = new Empresa();

    modeloEmpresa.nombre = parametros.nombre;
    modeloEmpresa.direccion = parametros.direccion;
    modeloEmpresa.descripcion = parametros.descripcion;
    modeloEmpresa.rol = 'Empresa';

    modeloEmpresa.save((err, empresaGuardada) => {
        if (err) return res.status(500).send({ mensaje: 'Hubo un error en la peticion' })
        if (!empresaGuardada) return res.status(500).send({ mensaje: 'Hubo un error al agregar la empresa' })

        return res.status(200).send({ empresa: empresaGuardada })
    })



}

function editarEmpresa(req, res) {
    const parametros = req.body;
    const idEmpresa = req.params.idEmpresa;
    if (req.user.rol = 'SuperAdmin') {

        Empresa.findByIdAndUpdate(idEmpresa, parametros, { new: true }, (err, empresaActualizada) => {
            if (err) return res.status(500).send({ mensaje: 'Hubo en la peticion' });
            if (!empresaActualizada) res.status(500).send({ mensaje: 'Hubo un error al actualizar la empresa' })

            return res.status(200).send({ empresa: empresaActualizada })
        })

    } else {
        return res.status(500).send({ mensaje: 'Solo los admnistradores pueden editar las empresas' })
    }
}

function eliminarEmpresa(req, res) {
    const idEmpresa = req.params.idEmpresa;

    if (req.user.rol == 'SuperAdmin') {
        Empresa.findByIdAndDelete({ _id: idEmpresa }, (err, empresaEliminada) => {
            if (err) return res.status(500).send({ mensaje: 'Hubo un error en la peticion' });
            if (!empresaEliminada) return res.status(500).send({ mensaje: 'Hubo un error al eliminar la empresa' });

            return res.status(200).send({ empresa: empresaEliminada })
        })
    } else {
        return res.status(500).send({ mensaje: 'Solo los administradores pueden eliminar las empresas' })
    }

}
function obtenerEmpresas(req, res) {

    Empresa.find({}, (err, empresaEncontradas) => {
        if (err) return res.status(500).send({ mensaje: 'Hubo un error en la peticion' })
        if (!empresaEncontradas) return res.status(500).send({ mensaje: 'Hubo un error al obtener las empresas' })

        return res.status(200).send({ empresa: empresaEncontradas })
    })
}
module.exports = {
    agregarEmpresa,
    editarEmpresa,
    eliminarEmpresa,
    obtenerEmpresas
}