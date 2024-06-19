import jwt from 'jsonwebtoken';

export const generateJWT = (uid = '', codeUser = '') => {
    return new Promise((resolve, reject) => {
        const payload = { uid, codeUser };
        jwt.sing(
            payload,
            process.env.SECRETORPRIVATEKEY,
            {
                expiresIn: '4h'
            },
            (err, token) => {
                if(err) {
                    console.log(err);
                    reject('No se pudo generar el token');
                } else {
                    resolve(token);
                }
            }
        )
    })
}