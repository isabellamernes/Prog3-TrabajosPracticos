import { Router } from 'express';
import { browse, read, add, edit, del } from '../controllers/salon.controller.js';

const router = Router();

// BROWSE - Obtener todos los salones
router.get('/', browse);

// READ - Obtener un salón por ID
router.get('/:id', read);

// ADD - Crear un nuevo salón
router.post('/', add);

// EDIT - Actualizar un salón existente
router.put('/:id', edit);

// DELETE - Eliminar (lógicamente) un salón
router.delete('/:id', del);

export default router;