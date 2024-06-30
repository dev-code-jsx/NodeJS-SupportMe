import mongoose from 'mongoose';

const MensajeSchema = new mongoose.Schema({
    remitente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    contenido: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const ConversacionSchema = new mongoose.Schema({
    usuarios: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }],
    fecha: {
        type: Date,
        default: Date.now
    },
    mensajes: [MensajeSchema]
});

const Conversacion = mongoose.model('Conversacion', ConversacionSchema);
export default Conversacion;