import mongoose from 'mongoose';

const DiarioSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    entrada: {
        type: String,
        required: [true, 'La entrada es obligatoria'],
    }
}, {
    timestamps: true,
});

export default mongoose.model('Diario', DiarioSchema);