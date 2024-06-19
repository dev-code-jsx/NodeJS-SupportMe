import { response, request } from "express";
import bcryptjs from "bcryptjs";
import Usuario from "./user.model.js";

export const usuariosPost = async (req, res) => {
    const { nombre, correo, password, role } = req.body;
    const usuario = new Usuario({ nombre, correo, password, role });

    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    // Solo buscar preceptores si el role no es PRECEPTOR_ROLE
    if (role !== 'PRECEPTOR_ROLE') {
        const preceptores = await Usuario.find({ role: 'PRECEPTOR_ROLE' });
        if (preceptores.length === 0) {
            return res.status(400).json({
                msg: 'No hay preceptores disponibles en este momento, inténtalo más tarde'
            });
        }

        const preceptor = preceptores[Math.floor(Math.random() * preceptores.length)];
        usuario.preceptor = preceptor._id;
    }

    await usuario.save();
    res.json({ usuario });
};

export const usuarioGet = async (req = request, res = response) => {
    const usuarios = await Usuario.find().select('-password');
    res.json({ usuarios });
}

export const getUsuarioById = async (req, res) => {
    const { id } = req.params;
    const usuario = await Usuario.findById(id);
    res.status(200).json({
        usuario
    });
}

export const usuarioPut = async (req, res = response) => {
    const { id } = req.params;
    const { _id, password, correo, ...resto } = req.body;

    if (password) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto, { new: true });

    res.status(200).json({
        usuario
    });
}

export const usuarioDelete = async (req, res) => {
    const { id } = req.params;

    // Eliminar completamente el usuario
    const usuario = await Usuario.findByIdAndDelete(id);

    if (!usuario) {
        return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    res.json({ msg: 'Usuario eliminado correctamente' });
}