import Diario from './diario.model.js'; 
import Usuario from '../user/user.model.js'
import mongoose from 'mongoose';

export const diarioPost = async (req, res) => {
    const { contenido } = req.body;
    const usuario = req.usuario._id;

    const fechaHoy = new Date().toISOString().split('T')[0];

    let diario = await Diario.findOne({ usuario, fecha: fechaHoy });

    if (!diario){
        diario = new Diario({ usuario, fecha: fechaHoy, entreadas: [{ contenido }] });
    } else {
        diario.entradas.push({ contenido });
    }

    await diario.save();

    res.status(201).json(diario);
};

export const getDiarioByPacienteId = async (req, res) => {
    const { pacienteId } = req.params;
    const usuario = req.usuario;

    const paciente = await Usuario.findById(pacienteId);
    if (!paciente) {
        return res.status(404).json({
            msg: 'Patient not found'
        });
    }

    if (!paciente._id.equals(usuario._id) && !paciente.preceptor.equals(usuario._id)) {
        return res.status(403).json({
            msg: "You don't have access to view this patient's diaries"
        });
    }

    const diarios = await Diario.find({ usuario: pacienteId }).populate('usuario', 'nombre');

    res.json(diarios);
}

export const getDiarioById = async (req, res) => {
    const { id } = req.params;
    const usuario = req.usuario;

    const diario = await Diario.findById(id).populate('usuario', 'nombre preceptor');

    if (!diario) {
        return res.status(404).json({
            msg: 'Diary not found'
        });
    }

    if (!diario.usuario._id.equals(usuario._id) && !diario.usuario.preceptor.equals(usuario._id)) {
        return res.status(403).json({
            msg: "You don't have access to view this diary"
        });
    }

    res.json(diario);
}