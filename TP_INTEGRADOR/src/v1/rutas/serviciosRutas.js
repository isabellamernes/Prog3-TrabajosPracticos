// src/v1/rutas/serviciosRutas.js
import express from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import autorizarUsuarios from '../../middlewares/autorizarUsuarios.js';
import ServiciosControlador from '../../controladores/serviciosControlador.js';

const controlador = new ServiciosControlador();
const router = express.Router();

// 1=Admin, 2=Empleado, 3=Cliente
// Listar (Todos los roles)
router.get('/', autorizarUsuarios([1, 2, 3]), controlador.buscarTodos);
router.get('/:servicio_id', autorizarUsuarios([1, 2, 3]), controlador.buscarPorID);

// Crear (Admin y Empleado)
router.post('/', 
    autorizarUsuarios([1, 2]),
    [
        check('descripcion', 'La descripción es necesaria.').notEmpty(),
        check('importe', 'El importe es necesario y debe ser numérico.').notEmpty().isFloat({ min: 0 }),
        validarCampos
    ],
    controlador.crear
);

// Modificar (Admin y Empleado)
router.put('/:servicio_id', 
    autorizarUsuarios([1, 2]),
    [
        check('descripcion').optional().notEmpty().withMessage('La descripción no puede estar vacía.'),
        check('importe').optional().isFloat({ min: 0 }).withMessage('El importe debe ser numérico.'),
        validarCampos
    ],
    controlador.modificar
);

// Eliminar (Admin y Empleado)
router.delete('/:servicio_id', 
    autorizarUsuarios([1, 2]), 
    controlador.eliminar
);

export { router };