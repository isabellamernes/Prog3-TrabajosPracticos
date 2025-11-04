import express from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import autorizarUsuarios from '../../middlewares/autorizarUsuarios.js';
import TurnosControlador from '../../controladores/turnosControlador.js';

const controlador = new TurnosControlador();
const router = express.Router();

// 1=Admin, 2=Empleado, 3=Cliente
router.get('/', autorizarUsuarios([1, 2, 3]), controlador.buscarTodos);
router.get('/:turno_id', autorizarUsuarios([1, 2, 3]), controlador.buscarPorID);

router.post('/', 
    autorizarUsuarios([1, 2]),
    [
        check('orden', 'El orden es necesario y debe ser numérico.').notEmpty().isInt(),
        check('hora_desde', 'La hora_desde es necesaria (HH:mm).').notEmpty().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        check('hora_hasta', 'La hora_hasta es necesaria (HH:mm).').notEmpty().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        validarCampos
    ],
    controlador.crear
);

router.put('/:turno_id', 
    autorizarUsuarios([1, 2]),
    [
        check('orden').optional().isInt().withMessage('El orden debe ser numérico.'),
        check('hora_desde').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Formato HH:mm requerido.'),
        check('hora_hasta').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Formato HH:mm requerido.'),
        validarCampos
    ],
    controlador.modificar
);

router.delete('/:turno_id', 
    autorizarUsuarios([1, 2]), 
    controlador.eliminar
);

export { router };