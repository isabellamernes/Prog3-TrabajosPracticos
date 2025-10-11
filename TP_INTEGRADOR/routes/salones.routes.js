// routes/salones.routes.js

import { Router } from 'express';
import { browse, read, add, edit, del } from '../controllers/salon.controller.js';
import { verificarJWT } from '../middlewares/verificar-jwt.js';
import { autorizarRol } from '../middlewares/autorizar-rol.js';
import { salonPostValidations, salonPutValidations } from '../middlewares/salon-validations.js';

const router = Router();

// Se definen constantes para los roles para mejorar la legibilidad.
const ROL_ADMIN = 1;
const ROL_EMPLEADO = 2;
const ROL_CLIENTE = 3;

// BROWSE - Obtener todos los salones (Permitido a todos los roles autenticados)
router.get('/', [
    verificarJWT,
    autorizarRol([ROL_ADMIN, ROL_EMPLEADO, ROL_CLIENTE])
], browse);

// READ - Obtener un salón por ID (Permitido a todos los roles autenticados)
router.get('/:id', [
    verificarJWT,
    autorizarRol([ROL_ADMIN, ROL_EMPLEADO, ROL_CLIENTE])
], read);

// ADD - Crear un nuevo salón (Solo Admin y Empleado)
router.post('/', [
    verificarJWT,
    autorizarRol([ROL_ADMIN, ROL_EMPLEADO]),
    salonPostValidations // Validaciones antes de llegar al controlador
], add);

// EDIT - Actualizar un salón existente (Solo Admin y Empleado)
router.put('/:id', [
    verificarJWT,
    autorizarRol([ROL_ADMIN, ROL_EMPLEADO]),
    salonPutValidations // Validaciones antes de llegar al controlador
], edit);

// DELETE - Eliminar lógicamente un salón (Solo Admin y Empleado)
router.delete('/:id', [
    verificarJWT,
    autorizarRol([ROL_ADMIN, ROL_EMPLEADO])
], del);

export default router;