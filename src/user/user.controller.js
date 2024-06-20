import { response, request } from "express";
import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";
import Usuario from "./user.model.js";
import dotenv from 'dotenv';

dotenv.config();

export const usuariosPost = async (req, res) => {
    const { nombre, correo, password, role } = req.body;
    const usuario = new Usuario({ nombre, correo, password, role });

    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    if (role !== 'PRECEPTOR_ROLE') {
        const preceptores = await Usuario.find({ role: 'PRECEPTOR_ROLE' });
        if (preceptores.length === 0) {
            return res.status(400).json({
                msg: 'No hay preceptores disponibles en este momento, inténtalo más tarde'
            });
        }

        const preceptor = preceptores[Math.floor(Math.random() * preceptores.length)];
        usuario.preceptor = preceptor._id;
    }

    await usuario.save();

    try {
        const config = {
            host: 'smtp.gmail.com',
            port: 587,
            auth: {
                user: "kinalgrupo@gmail.com",
                pass: process.env.PASS
            }
        };

        const transport = nodemailer.createTransport(config);

        const mensaje = {
            from: 'kinalgrupo@gmail.com',
            to: correo,
            subject: 'Bienvenido a SupportMe',
            html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Bienvenido a SupportMe</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f5f5f5;
                        padding: 20px;
                        text-align: center;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #fff;
                        padding: 40px;
                        border-radius: 8px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-bottom: 20px;
                    }
                    .header img {
                        max-width: 50px;
                        margin-right: 10px;
                    }
                    .header h1 {
                        margin: 0;
                        font-size: 24px;
                        color: #333;
                    }
                    h1 {
                        color: #333;
                    }
                    p {
                        color: #666;
                    }
                    .cta-button {
                        display: inline-block;
                        background-color: #007bff;
                        color: #fff;
                        text-decoration: none;
                        padding: 10px 20px;
                        border-radius: 5px;
                        margin-top: 20px;
                    }
                    .cta-button:hover {
                        background-color: #0056b3;
                    }
                    .footer {
                        margin-top: 20px;
                        text-align: center;
                        color: #aaa;
                    }
                    .footer a {
                        color: #007bff;
                        text-decoration: none;
                    }
                    .footer a:hover {
                        text-decoration: underline;
                    }
                    .highlight {
                        background-color: #007bff;
                        color: #fff;
                        padding: 5px 10px;
                        border-radius: 5px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <img src="https://i.imgur.com/5dN2aE8.jpeg" alt="SupportMe Logo">
                        <h1>SupportMe</h1>
                    </div>
                    <h1>Bienvenido a la Plataforma</h1>
                    <p>Hola ${nombre},</p>
                    <p>Estamos muy emocionados de tenerte con nosotros,</p>
                    <p><strong>Correo:</strong> ${correo}</p>
                    <p>Gracias por unirte a nuestra comunidad.</p>
                    <div class="footer">
                        <p>&copy; 2024 SupportMe. Todos los derechos reservados.</p>
                    </div>
                </div>
            </body>
            </html>
            `
        };

        const info = await transport.sendMail(mensaje);
        console.log("Email sent: ", info.messageId);

        res.status(201).json({ msg: 'Usuario creado y correo enviado', usuario });
    } catch (error) {
        console.error("Error enviando correo: ", error);
        res.status(500).json({ msg: 'Error creando usuario o enviando correo' });
    }
};

export const postPreceptor = async (req, res) => {
    const { nombre, correo, password } = req.body;
    const role = 'PRECEPTOR_ROLE';
    const usuario = new Usuario({ nombre, correo, password, role });

    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    await usuario.save();
    res.json({ usuario });
};

export const usuarioGet = async (req = request, res = response) => {
    const usuarios = await Usuario.find().select('-password');
    res.json({ usuarios });
}

export const getUsuarioById = async (req, res) => {
    const { id } = req.params;
    const usuario = await Usuario.findById(id);
    res.status(200).json({
        usuario
    });
}

export const usuarioPut = async (req, res = response) => {
    const { id } = req.params;
    const { _id, password, correo, ...resto } = req.body;

    if (password) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto, { new: true });

    res.status(200).json({
        usuario
    });
}

export const usuarioDelete = async (req, res) => {
    const { id } = req.params;

    const usuario = await Usuario.findByIdAndDelete(id);

    if (!usuario) {
        return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    res.json({ msg: 'Usuario eliminado correctamente' });
}

export const newUser = async () => {
    try {
        const existingAdmin = await Usuario.findOne({ correo: "admin-plataform@gmail.com" }); // Cambiado a 'correo'

        if (existingAdmin) {
            console.log("Admin user already exists");
        } else {
            const newAdmin = new Usuario({
                nombre: 'admin-plataform',
                correo: 'admin-plataform@gmail.com',
                password: 'admin123',
                role: 'ADMIN_ROLE'
            });

            const salt = bcryptjs.genSaltSync();
            newAdmin.password = bcryptjs.hashSync(newAdmin.password, salt);

            await newAdmin.save();
            console.log("Admin user created successfully", newAdmin);
        }
    } catch (error) {
        console.log("Error creating admin user", error);
    }
}