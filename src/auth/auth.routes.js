import bcryptjs from 'bcryptjs';
import User from '../user/user.model.js';
import { generateJWT } from '../helpers/generate-jwt.js';

export const login = async (req, res) => {
    const { correo, password } = req.body;

    try {
        const user = await User.findOne({ correo });

        if(user && (await bcryptjs.compare(password, user.password))){
            const token = await generateJWT(user.id);

            res.status(200).json({
                msg: "Login OK!!!",
                userDetails: {
                    id: user.id,
                    token: token
                },
            });
        }

        if (!user) {
            return res
                .status(400)
                .send(`Wrong credentials, ${correo} doesn't exists en database`);
        }

        const validPassword = bcryptjs.compareSync(password, user.password);
        if(!validPassword){
            return res.status(400).send("wrong password");
        }
    } catch (e) {
        res.status(500).json({
            msg: 'Error interno, hable con el administrador'
        });
    }
}