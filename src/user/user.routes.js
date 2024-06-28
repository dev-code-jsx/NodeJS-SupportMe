import { Router } from "express";
import { check } from "express-validator";
import {
    usuariosPost,
    usuarioGet,
    getUsuarioById,
    usuarioPut,
    usuarioDelete,
    postPreceptor,
    getPacientesByPreceptorId,
    getPreceptores,
    getPacientes,
} from './user.controller.js';

import {
    existenteEmail,
    existeUsuarioById,
} from '../helpers/db-validators.js';

import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validate-jwt.js';
import { isAdmin, isPreceptor, isAdminOrPreceptor, isPaciente } from "../middlewares/validate-role.js"

const router = Router();

router.get('/', 
    [
        validarJWT,
        isAdminOrPreceptor  
    ],
    usuarioGet
);

router.get(
    "/preceptores",
    [
        validarJWT,
        isAdminOrPreceptor
    ],
    getPreceptores
);


router.get(
    "/pacientes",
    [
        validarJWT,
        isAdminOrPreceptor
    ],
    getPacientes
);

router.get(
    "/preceptor/:id/pacientes",
    [
        validarJWT,  
        isAdminOrPreceptor,
        check("id", "No es un ID válido").isMongoId(),
        validarCampos
    ],
    getPacientesByPreceptorId
);


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

router.post(
    "/addPreceptor",
    [
        validarJWT,
        isAdmin,
        check("nombre", "El nombre es obligatorio").not().isEmpty(),
        check("password", "La contraseña es obligatoria").not().isEmpty(),
        check("password", "La contraseña debe ser más de 6 letras".italics()).isLength({ min: 6 }),
        check("correo", "El correo no es válido").isEmail(),
        check("correo").custom(existenteEmail),
        validarCampos,
    ],
    postPreceptor
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
        validarJWT,
        isPaciente,
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos,
    ],
    usuarioPut
);

router.delete(
    "/:id",
    [
        validarJWT,
        isPaciente,
        isAdmin,
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos,
    ],
    usuarioDelete
);

export default router;