import jwt from 'jsonwebtoken';

export const generateJWT = (uid = '', role = '') => {
    return new Promise((resolve, reject) => {
        const payload = { uid, role }; // Añadir el rol al payload
        jwt.sign(
            payload,
            process.env.SECRETORPRIVATEKEY,
            {
                expiresIn: '48h'
            },
            (err, token) => {
                if (err) {
                    console.log(err);
                    reject('No se pudo generar el token');
                } else {
                    resolve(token);
                }
            }
        );
    });
}