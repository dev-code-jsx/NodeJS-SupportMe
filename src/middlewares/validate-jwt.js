import jwt from 'jsonwebtoken';
import User from "../user/user.model.js"; // Asegúrate de importar tu modelo de usuario

export const validarJWT = async (req, res, next) => {
    let token = req.body.token || req.query.token || req.headers['authorization'];

    if (!token) {
        return res.status(401).send('A token is required for authentication');
    }

    try {
        token = token.replace(/^Bearer\s+/, '');
        const decoded = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        const user = await User.findById(decoded.uid);
        if (!user) {
            return res.status(401).send('Invalid Token');
        }

        req.user = {
            uid: user.id,
            role: user.role
        };

        console.log("Decoded JWT:", decoded); 
        console.log("User:", user); 

    } catch (e) {
        console.log(e);
        return res.status(401).send('Invalid Token');
    }

    return next();
}