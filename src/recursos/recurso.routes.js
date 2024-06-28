import { Router } from 'express';
import { check } from 'express-validator';
import {
    recursoGet,
    recursosPost,
    recursosPut,
    recursosDelete,
    recursoGetById
} from './recurso.controller.js';
import {
    existeRecursoById
} from '../helpers/db-validators.js';

import { validarCampos } from '../middlewares/validar-campos.js';

const router = Router();

router.get('/', usuarioGet);

router.post(
    "/",
    [
        check("titulo", "El título es obligatorio").not().isEmpty(),
        check("tipo", "El tipo es obligatorio").not().isEmpty(),
        check("contenido", "El contenido es obligatorio").not().isEmpty(),
        validarCampos,
    ],
    recursosPost
);

router.get(
    "id",
    [
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeRecursoById),
        validarCampos,
    ],
    getRecursosById
);

router.put(
    "/:id",
    [
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeRecursoById),
        validarCampos,
    ],
    recursosPut
);

router.delete(
    "/:id",
    [
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeRecursoById),
        validarCampos,
    ],
    recursosDelete
);

export default router;  