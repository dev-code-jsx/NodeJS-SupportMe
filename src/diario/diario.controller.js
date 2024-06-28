import Diario from './diario.model.js'; 
import Usuario from '../user/user.model.js'
import mongoose from 'mongoose';



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