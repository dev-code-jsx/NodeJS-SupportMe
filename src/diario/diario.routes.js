import { Router } from 'express';
import { check } from 'express-validator';
import {
    diarioPost,
    getDiarioByPacienteId,
    getDiarioById,
    getDiarioByDate,
    diariosPut,
    deleteDiario
} from "./diario.controller.js";
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validate-jwt.js';
import { isPaciente, isPreceptorOrPaciente ,isPreceptor, isAdmin, isAdminOrPreceptor } from '../middlewares/validate-role.js';

const router = Router();

router.post(
    '/',
    [
        validarJWT,
        isPaciente,
        check('contenido', 'the content is required').not().isEmpty(),
        validarCampos
    ],
    diarioPost
);

router.get(
    '/paciente/:pacienteId',
    [
        validarJWT,
        isPreceptorOrPaciente,
        check('pacienteId', 'No es un ID válido').isMongoId(),
        validarCampos,
    ],
    getDiarioByPacienteId
);

router.get(
    '/paciente/:pacienteId/fecha/:fecha',
    [
        validarJWT,
        check('pacienteId', 'No es un ID válido').isMongoId(),
        check('fecha', 'La fecha es obligatoria').isDate(),
        validarCampos,
    ],
    getDiarioByDate
);

router.get(
    '/:id',
    [
        validarJWT,
        check('id', 'No es un ID válido').isMongoId(),
        validarCampos,
    ],
    getDiarioById
);

router.put(
    '/:id',
    [
        validarJWT,
        check('id', 'No es un ID válido').isMongoId(),
        check('contenido', 'El contenido es obligatorio').not().isEmpty(),
        validarCampos,
    ],
    diariosPut
);

router.delete(
    '/:id',
    [
        validarJWT,
        check('id', 'No es un ID válido').isMongoId(),
        validarCampos,
    ],
    deleteDiario
);

export default router;