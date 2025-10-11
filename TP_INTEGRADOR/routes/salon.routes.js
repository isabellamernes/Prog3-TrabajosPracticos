// routes/salon.routes.js

import { Router } from 'express';
import { listarTodos, obtenerPorId, crear, editar, eliminar } from '../controllers/salon.controller.js';
import { verificarJWT } from '../middlewares/verificar-jwt.js';
import { autorizarRol } from '../middlewares/autorizar-rol.js';
import { validacionesPostSalon, validacionesPutSalon } from '../middlewares/salon-validations.js';

const router = Router();

const ROL_ADMIN = 1;
const ROL_EMPLEADO = 2;
const ROL_CLIENTE = 3;

router.get('/', [
    verificarJWT, 
    autorizarRol([ROL_ADMIN, ROL_EMPLEADO, ROL_CLIENTE]) 
], listarTodos);

router.get('/:id', [
    verificarJWT, 
    autorizarRol([ROL_ADMIN, ROL_EMPLEADO, ROL_CLIENTE])
], obtenerPorId);

router.post('/', [
    verificarJWT, 
    autorizarRol([ROL_ADMIN, ROL_EMPLEADO]), 
    validacionesPostSalon
], crear);

router.put('/:id', [
    verificarJWT, 
    autorizarRol([ROL_ADMIN, ROL_EMPLEADO]), 
    validacionesPutSalon
], editar);

router.delete('/:id', [
    verificarJWT, 
    autorizarRol([ROL_ADMIN, ROL_EMPLEADO])
], eliminar);

export default router;