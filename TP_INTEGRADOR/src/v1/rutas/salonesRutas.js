import express from 'express';
import apicache from 'apicache';
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import autorizarUsuarios from '../../middlewares/autorizarUsuarios.js'; 
import SalonesControlador from '../../controladores/salonesControlador.js';

const salonesControlador = new SalonesControlador();
const router = express.Router();
let cache = apicache.middleware;

// 1=Admin, 2=Empleado, 3=Cliente
// Listar (Todos los roles)
router.get('/', cache('5 minutes'), autorizarUsuarios([1, 2, 3]), salonesControlador.buscarTodos); 
router.get('/:salon_id', autorizarUsuarios([1, 2, 3]), salonesControlador.buscarPorID);

// Modificar (Admin y Empleado)
router.put('/:salon_id', 
    autorizarUsuarios([1, 2]), 
    [
        check('titulo').optional().notEmpty(),
        check('direccion').optional().notEmpty(),
        check('capacidad').optional().isInt(), 
        check('importe').optional().isFloat(),
        check('latitud').optional().isFloat(),
        check('longitud').optional().isFloat(),
        validarCampos
    ],
    salonesControlador.modificar
);

// Crear (Admin y Empleado)
router.post('/', 
    autorizarUsuarios([1, 2]), 
    [
        check('titulo', 'El título es necesario.').notEmpty(),
        check('direccion', 'La dirección es necesaria.').notEmpty(),
        check('capacidad', 'La capacidad es necesaria.').notEmpty().isInt(), 
        check('importe', 'El importe es necesario.').notEmpty().isFloat(), 
        check('latitud').optional().isFloat(), 
        check('longitud').optional().isFloat(),
        validarCampos    
    ],
    salonesControlador.crear
);

// Eliminar (Admin y Empleado)
router.delete('/:salon_id', 
    autorizarUsuarios([1, 2]), 
    salonesControlador.eliminar
);

export { router };