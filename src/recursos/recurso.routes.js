import { Router } from 'express';
import { check } from 'express-validator';
import {
    recursoGet,
    recursosPost,
    recursosPut,
    recursosDelete,
    recursoGetById
} from './recurso.controller.js';
