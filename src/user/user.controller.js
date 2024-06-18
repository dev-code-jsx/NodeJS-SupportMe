import { response, request } from "express";
import bcrypt from "bcrypt";
import Usuario from "./user.model.js";

export const usuarioPost = async (req, res) => {
    const {nombre, correo, password} = req.body;
    const usuario = new Usuario({nombre, correo, password});

    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    await usuario.save();

    res.status(200).json({
        usuario
    });
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

