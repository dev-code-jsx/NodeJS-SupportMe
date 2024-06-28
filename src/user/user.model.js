import mongoose from "mongoose";

const UsuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, "The name is required"]
    },
    correo: {
        type: String,
        required: [true, "The email is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "the password is required"]
    },
    role: {
        type: String,
        enum: ['ADMIN_ROLE', 'PACIENTE_ROLE', 'PRECEPTOR_ROLE'],
        default: "PACIENTE_ROLE"
    },
    estado: {
        type: Boolean,
        default: true
    },
    preceptor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
    }
    }, {
        timestamps: true,
    });

UsuarioSchema.methods.toJSON = function() {
    const { __v, password, _id, ...usuario } = this.toObject();
    usuario.uid = _id;
    return usuario;
}

export default mongoose.model("Usuario", UsuarioSchema);