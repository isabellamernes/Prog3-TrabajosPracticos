import express from 'express';
import SalonesControlador from '../../controladores/salonesControlador.js';



const salonesControlador = new SalonesControlador();
const router = express.Router();

// BREAD completo
router.get('/', salonesControlador.buscarTodos);            // Browse
router.get('/:salon_id', salonesControlador.buscarPorId);   // Read
router.post('/', salonesControlador.crear);                 // Add
router.put('/:salon_id', salonesControlador.editar);        // Edit
router.delete('/:salon_id', salonesControlador.eliminar);   // Delete

export { router };
