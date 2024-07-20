import { Router } from 'express';
import { check } from 'express-validator';
import {
    recursoGet,
    recursosPost,
    recursosPut,
    recursosDelete,
    getRecursoById
} from './recurso.controller.js';
import {
    existeRecursoById
} from '../helpers/db-validators.js';

import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validate-jwt.js';
import { isAdmin, isPreceptor, isAdminOrPreceptor, isPaciente } from "../middlewares/validate-role.js"

const router = Router();

router.get('/',
    [
        validarJWT,
    ],
    recursoGet
);

router.post(
    "/",
    [
        validarJWT,
        isAdmin,
        check("imagen", "La imagen es obligatoria").not().isEmpty(),
        check("titulo", "El título es obligatorio").not().isEmpty(),
        check("tipo", "El tipo es obligatorio").not().isEmpty(),
        check("contenido", "El contenido es obligatorio").not().isEmpty(),
        validarCampos,
    ],
    recursosPost
);

router.get(
    "/:id",
    [
        validarJWT,
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeRecursoById),
        validarCampos,
    ],
    getRecursoById
);

router.put(
    "/:id",
    [
        validarJWT,
        isAdmin,
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeRecursoById),
        validarCampos,
    ],
    recursosPut
);

router.delete(
    "/:id",
    [
        validarJWT,
        isAdmin,
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeRecursoById),
        validarCampos,
    ],
    recursosDelete
);

export default router;  