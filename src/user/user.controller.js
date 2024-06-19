import { response, request } from "express";
import bcrypt from "bcrypt";
import Usuario from "./user.model.js";

export const usuarioPost = async (req, res) => {
    const { nombre, correo, password } = req.body;
    const usuario = new Usuario({ nombre, correo, password });

    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    const preceptor = await Usuario.findOne({ role: 'PRECEPTOR_ROLE' });
    if (preceptor.length > 0){
        const preceptor = preceptores[Math.floor(Math.random() * preceptores.length)];
        usuario.preceptor = preceptor._id;
    }

    await usuario.save();
    res.json({ usuario});
} 

export const usuarioGet = async (req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(number(limite))
    ]);

    res.status(200).json({
        total,
        usuarios
    });
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

    if(password) {
        const salt = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto, { new: true });

    res.status(200).json({
        usuario
    }); 
} 

export const usuarioDelete = async (req, res) => {
    const {id} = req.params;

    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false});

    res.status(200).json({ msg: 'Usuario eliminado', usuario});
}