import nodemailer from 'nodemailer';

export const enviarCorreo = async (destinatario, asunto, contenidoHTML) => {
    try {
        const configCorreo = {
            host: 'smtp.gmail.com',
            port: 587,
            auth: {
                user: 'kinalgrupo@gmail.com',
                pass: process.env.PASS
            },
        };

        const transporter = nodemailer.createTransport(configCorreo);

        const mensajeCorreo = {
            from: 'kinalgrupo@gmail.com',
            to: destinatario,
            subject: asunto,
            html: contenidoHTML
        };

        const info = await transporter.sendMail(mensajeCorreo);
        console.log('Correo enviado:', info.messageId);

    } catch (error) {
        console.error('Error al enviar correo: ', error);
        throw new Error('Error al enviar correo');
    }
};