import { Router } from "express";
import { check } from "express-validator";
import {
    usuariosPost,
    usuarioGet,
    getUsuarioById,
    usuarioPut,
    usuarioDelete
} from './user.controller.js';

import {
    existenteEmail,
    existeUsuarioById,
} from '../helpers/db-validators.js';

import { validarCampos } from '../middlewares/validar-campos.js';

const router = Router();

router.get('/', usuarioGet);

router.post(
    "/",
    [
        check("nombre", "El nombre es obligatorio").not().isEmpty(),
        check("password", "La contraseña es obligatoria").not().isEmpty(),
        check("password", "La contraseña debe ser más de 6 letras".italics()).isLength({ min: 6 }),
        check("correo", "El correo no es válido").isEmail(),
        check("correo").custom(existenteEmail),
        validarCampos,
    ],
    usuariosPost
);

router.get(
    "/:id",
    [
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    getUsuarioById
);

router.put(
    "/:id",
    [
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos,
    ],
    usuarioPut
);

router.delete(
    "/:id",
    [
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos,
    ],
    usuarioDelete
);

export default router;