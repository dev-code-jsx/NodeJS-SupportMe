import Diario from './diario.model.js';
import Usuario from '../user/user.model.js'

export const diarioPost = async (req, res) => {
    const { contenido } = req.body;
    const { uid, role } = req.user;

    if (! role === 'PACIENTE_ROLE') {
        return res.status(403).json({
            msg: 'Only patients can create diaries'
        });
    }

    const fecha = new Date().toISOString().split('T')[0];

    let diario = await Diario.findOne({ usuario: uid, fecha });

    if (!diario) {
        diario = new Diario({
            usuario: uid,
            fecha,
            entradas: [{ contenido  }]
        });
    } else {
        diario.entradas.push({ contenido});
    }

    await diario.save();

    res.status(201).json({
        msg: 'Diary entry successfully created',
        diario
    });
};

export const getDiarioByPacienteId = async (req, res) => {
    const { pacienteId } = req.params;
    const usuario = req.user;

    if (usuario.role === 'PACIENTE_ROLE' && usuario.uid !== pacienteId) {
        return res.status(403).json({
            msg: 'You cannot see the diaries of other patients'
        });
    }

    if (usuario.role === 'PRECEPTOR_ROLE') {
        const paciente = await Usuario.findById(pacienteId);
        if (!paciente || paciente.preceptor.toString() !== usuario.uid) {
            return res.status(403).json({
                msg: 'You are not the preceptor assigned to this patient.'
            });
        }
    }

    const diarios = await Diario.find({ usuario: pacienteId });

    res.status(200).json({
        diarios
    });
};

export const getDiarioById = async (req, res) => {
    const { id } = req.params;
    const usuario = req.usuario;

    const diario = await Diario.findById(id).populate('usuario');

    if (!diario) {
        return res.status(404).json({
            msg: 'No journal found with this ID'
        });
    }

    if (usuario.role === 'PACIENTE_ROLE' && diario.usuario._id.toString() !== usuario._id.toString()) {
        return res.status(403).json({
            msg: "You cannot see another patient's diary"
        });
    }

    if (usuario.role === 'PRECEPTOR_ROLE' && diario.usuario.preceptor.toString() !== usuario._id.toString()) {
        return res.status(403).json({
            msg: 'You are not the preceptor assigned to this patient.'
        });
    }

    res.status(200).json({
        diario
    });
};


export const getDiarioByDate = async (req, res) => {
    const { pacienteId, fecha } = req.params;
    const usuario = req.usuario;

    if (usuario.role === 'PACIENTE_ROLE' && usuario._id.toString() !== pacienteId) {
        return res.status(403).json({
            msg: 'You cannot see the diaries of other patients'
        });
    }

    if (usuario.role === 'PRECEPTOR_ROLE') {
        const paciente = await Usuario.findById(pacienteId);
        if (!paciente || paciente.preceptor.toString() !== usuario._id.toString()) {
            return res.status(403).json({
                msg: 'You are not the preceptor assigned to this patient.'
            });
        }
    }

    const diario = await Diario.findOne({ usuario: pacienteId, fecha });

    if (!diario) {
        return res.status(404).json({
            msg: 'No diary was found for this date'
        });
    }

    res.status(200).json({
        diario
    });
};


export const diariosPut = async (req, res) => {
    const { id } = req.params;
    const { contenido } = req.body;
    const usuario = req.usuario;

    const diario = await Diario.findById(id).populate('usuario');

    if (!diario) {
        return res.status(404).json({
            msg: 'No diary found with this ID'
        });
    }

    if (usuario.role === 'PACIENTE_ROLE' && diario.usuario._id.toString() !== usuario._id.toString()) {
        return res.status(403).json({
            msg: "You cannot update another patient's diary"
        });
    }

    if (usuario.role === 'PRECEPTOR_ROLE' && diario.usuario.preceptor.toString() !== usuario._id.toString()) {
        return res.status(403).json({
            msg: 'You are not the preceptor assigned to this patient.'
        });
    }

    diario.entradas.push({ contenido });
    await diario.save();

    res.status(200).json({
        msg: 'Diary entry successfully updated',
        diario
    });
};



export const deleteDiario = async (req, res) => {
    const { id } = req.params;
    const usuario = req.usuario;

    const diario = await Diario.findById(id).populate('usuario');

    if (!diario) {
        return res.status(404).json({
            msg: 'No diary found with this ID'
        });
    }

    if (usuario.role === 'PACIENTE_ROLE' && diario.usuario._id.toString() !== usuario._id.toString()) {
        return res.status(403).json({
            msg: "You cannot delete another patient's diary"
        });
    }

    if (usuario.role === 'PRECEPTOR_ROLE' && diario.usuario.preceptor.toString() !== usuario._id.toString()) {
        return res.status(403).json({
            msg: 'You are not the preceptor assigned to this patient.'
        });
    }

    await Diario.findByIdAndDelete(id);

    res.status(200).json({
        msg: 'Diary successfully deleted'
    });
};