import Conversacion from './mensaje.model.js';
import Usuario from '../user/user.model.js'

export const mensajePost = async (req, res) => {
    const { contenido, destinatarioId } = req.body;
    const remitenteId = req.user.uid; // Cambiado a req.user

    const remitente = await Usuario.findById(remitenteId);
    const destinatario = await Usuario.findById(destinatarioId);

    if (!destinatario || !remitente) {
        return res.status(404).json({
            msg: 'User not found'
        });
    }

    if (remitente.role === 'PACIENTE_ROLE') {
        if (!destinatario.preceptor || destinatario.preceptor.toString() !== remitente.preceptor.toString()) {
            return res.status(403).json({
                msg: 'You can only send messages to your assigned preceptor'
            });
        }
    }

    if (remitente.role === 'PRECEPTOR_ROLE') {
        if (destinatario.role !== 'PACIENTE_ROLE' || destinatario.preceptor.toString() !== remitente._id.toString()) {
            return res.status(403).json({
                msg: 'You can only send messages to your assigned patients'
            });
        }
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

    conversacion.mensajes.push({ remitente: remitenteId, contenido });
    await conversacion.save();

    // Rebuscar la conversación para hacer el populate
    conversacion = await Conversacion.findById(conversacion._id)
        .populate('usuarios', '_id nombre')
        .populate('mensajes.remitente', '_id nombre');

    res.status(201).json({
        msg: 'Message sent successfully',
        conversacion
    });
};

export const getConversaciones = async (req, res) => {
    const usuarioId = req.user.uid; // Cambiado a req.user

    /*const conversaciones = await Conversacion.find({
        usuarios: usuarioId
    }).populate('usuarios', '_id nombre').populate('mensajes.remitente', '_id nombre');*/

    res.status(200).json({
        conversaciones
    });
};

export const getConversacionesByDate = async (req, res) => {
    const { usuarioId, fecha } = req.params;
    const remitenteId = req.user.uid; // Cambiado a req.user

    const conversacion = await Conversacion.findOne({
        usuarios: { $all: [remitenteId, usuarioId] },
        fecha
    }).populate('usuarios', '_id nombre').populate('mensajes.remitente', '_id nombre');

    if (!conversacion) {
        return res.status(404).json({
            msg: 'Conversation not found for this date'
        });
    }

    res.status(200).json({
        conversacion
    });
};

export const getMensajesPendientes = async (req, res) => {
    const usuarioId = req.user.uid; // Cambiado a req.user

    const conversaciones = await Conversacion.find({
        usuarios: usuarioId,
        'mensajes.leido': false
    }).populate('usuarios', '_id nombre').populate('mensajes.remitente', '_id nombre');

    const mensajesPendientes = conversaciones.map(conversacion => {
        return {
            conversacionId: conversacion._id,
            mensajes: conversacion.mensajes.filter(mensaje => !mensaje.leido)
        };
    });

    res.status(200).json({
        mensajesPendientes
    });
};