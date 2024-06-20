import { Router } from "express";
import { check } from "express-validator";  

import { login } from "./auth.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";

const router = Router();

router.post(
    '/login',
    [
        check("correo", "El correo es obligatorio").isEmail(),
        check("correo", "El correo no es válido").not().isEmpty(),
        check("password", "La contraseña es obligatoria").not().isEmpty(),
        validarCampos,
    ],
    login
)

export default router;