import { Router } from "express";
import { check } from "express-validator";
import {
    mensajePost,
    getConversaciones,
    getConversacionesByDate,
    getMensajesPendientes
} from './mensaje.controller.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validate-jwt.js';
//import { isAdmin, isPreceptor, isAdminOrPreceptor, isPaciente } from "../middlewares/validate-role.js"

const router = Router();

router.post('/', [
    validarJWT,
    check('contenido', 'El contenido es obligatorio').not().isEmpty(),
    check('destinatarioId', 'El destinatario es obligatorio').not().isEmpty(),
    validarCampos
], mensajePost);

router.get('/', [
    validarJWT
], getConversaciones);

router.get('/:usuarioId/:fecha', [
    validarJWT
], getConversacionesByDate);

router.get('/pendientes', [
    validarJWT
], getMensajesPendientes);

export default router;  