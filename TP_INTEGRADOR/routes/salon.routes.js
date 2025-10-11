// routes/salones.routes.js

import { Router } from 'express';
// Se importan las funciones del controlador con sus nuevos nombres en español
import { listarTodos, obtenerPorId, crear, editar, eliminar } from '../controllers/salon.controller.js';
import { verificarJWT } from '../middlewares/verificar-jwt.js';
import { autorizarRol } from '../middlewares/autorizar-rol.js';
import { validacionesPostSalon, validacionesPutSalon } from '../middlewares/salon-validations.js'; // Nombres más descriptivos

const router = Router();

const ROL_ADMIN = 1;
const ROL_EMPLEADO = 2;
const ROL_CLIENTE = 3;

// Rutas con las funciones castellanizadas
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