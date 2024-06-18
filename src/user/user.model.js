import mongoose from "mongoose";

const UsuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, "El nombre es requerido"]
    },
    correo: {
        type: String,
        required: [true, "El correo es requerido"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "La contraseña es requerida"]
    },
    role: {
        type: String,
        enum: ['ADMIN_ROLE', 'PACIENTE_ROLE', 'PRECEPTOR_ROLE'],
        default: "PACIENTE_ROLE"
    },
    estado: {
        type: Boolean,
        default: true
    }
});

UsuarioSchema.methods.toJSON = function() {
    const { __v, password, _id, ...usuario } = this.toObject();
    usuario.uid = _id;
    return usuario;
}

export default mongoose.model("Usuario", UsuarioSchema);