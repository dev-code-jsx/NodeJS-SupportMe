import mongoose from 'mongoose';

const DiarioSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    fecha: {
        type: String,
        required: true,
    },
    entradas: [
        {
            contenido: {
                type: String,
                required: true
            }
        }
    ]
}, {
    timestamps: true,
});

export default mongoose.model('Diario', DiarioSchema);