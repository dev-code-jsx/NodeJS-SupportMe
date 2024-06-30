import Conversacion from './mensaje.model.js';
import Usuario from '../user/user.model.js'

export const mensajePost = async (req, res) => {
    const { contenido, destinatarioId } = req.body;
    const remitenteId = req.user._id;

    const remitente = await Usuario.findById(remitenteId);
    const destinatario = await Usuario.findById(destinatarioId);

    if(!destinatario || !remitente) {
        return res.status(404).json({
            msg: 'User not found'
        });
    }

    if (remitente.role === 'PACIENTE_ROLE' && destinatario.preceptor.toString() !== remitente._id.toString()) {
        return res.status(403).json({
            msg: 'Just can send messages to your preceptor'
        });
    }

    if (remitente.role === 'PRECEPTOR_ROLE' && destinatario.preceptor.toString() !== remitente._id.toString()) {
        return res.status(403).json({
            msg: 'Just can send messages to your patients'
        });
    }

    const fecha = new Date().toISOString().split('T')[0];

    let conversacion = await Conversacion.findOne({
        usuarios: { $all: [remitenteId, destinatarioId] },
        fecha
    });

    if (!conversacion) {
        conversacion = new Conversacion({
            usuarios: [remitenteId, destinatarioId],
            fecha,
            mensajes: []
        });
    }

    conversacion.mensaje.push({ remitente: remitenteId, contenido });
    await conversacion.save();

    res.status(201).json({
        msg: 'Message sent successfully',
        conversacion
    });
}

export const getConversaciones = async (req, res) => {
    const usuarioId = req.usuario._id;

    const conversaciones = await Conversacion.find({
        usuarios: usuarioId
    }).populate('usuarios', '_id nombre').populate('mensajes.remitente', '_id nombre');

    res.status(200).json({
        conversaciones
    });
}

export const getConversacionesByDate = async (req, res) => {
    const { usuarioId, fecha } = req.params;
    const remitenteId = req.usuario._id;

    const conversacion = await Conversacion.findOne({
        usuarios: { $all: [remitenteId, usuarioId] },
        fecha
    }).poputalte('usuarios', '_id nombre').populate('mensajes.remitente', '_id nombre');

    if(!conversacion){
        return res.status(404).json({
            msg: 'Conversation not found for this date'
        });
    }

    res.status(200).json({
        conversacion
    });
}