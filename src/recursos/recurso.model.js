import mongoose from "mongoose";

const RecursoSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: [true, 'El título es obligatorio'],
    },
    tipo: {
        type: String,
        required: [true, 'El tipo es obligatorio'],
        enum: ['lectura', 'juego'],
    },
    contenido: {
        type: String,
        required: [true, 'El contenido es obligatorio'],
    }
}, {
    timestamps: true,
});

export default mongoose.model('Recurso', RecursoSchema);
