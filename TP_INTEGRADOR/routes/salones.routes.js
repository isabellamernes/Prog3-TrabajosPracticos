// MODIFICACIÓN DE salones.routes.js

import { Router } from 'express';
import { browse, read, add, edit, del } from '../controllers/salon.controller.js';
// *******************************************************************
import { verificarJWT } from '../middlewares/verificar-jwt.js'; // Asume que existe
import { autorizarRol } from '../middlewares/autorizar-rol.js'; // Implementar
import { salonPostValidations, salonPutValidations } from '../middlewares/salon-validations.js'; // Implementar

const router = Router();
const ROL_ADMIN = 1;
const ROL_EMPLEADO = 2;
const ROL_CLIENTE = 3;

// BROWSE - Obtener todos los salones (Permitido a todos)
router.get('/', [
    verificarJWT, 
    autorizarRol([ROL_ADMIN, ROL_EMPLEADO, ROL_CLIENTE]) 
], browse);

// READ - Obtener un salón por ID (Permitido a todos)
router.get('/:id', [
    verificarJWT, 
    autorizarRol([ROL_ADMIN, ROL_EMPLEADO, ROL_CLIENTE])
], read);

// ADD - Crear un nuevo salón (Solo Empleado y Admin)
router.post('/', [
    verificarJWT, 
    autorizarRol([ROL_ADMIN, ROL_EMPLEADO]), 
    salonPostValidations // Validar campos
], add);

// EDIT - Actualizar un salón existente (Solo Empleado y Admin)
router.put('/:id', [
    verificarJWT, 
    autorizarRol([ROL_ADMIN, ROL_EMPLEADO]), 
    salonPutValidations // Validar campos
], edit);

// DELETE - Eliminar (lógicamente) un salón (Solo Empleado y Admin)
router.delete('/:id', [
    verificarJWT, 
    autorizarRol([ROL_ADMIN, ROL_EMPLEADO])
], del);

export default router;