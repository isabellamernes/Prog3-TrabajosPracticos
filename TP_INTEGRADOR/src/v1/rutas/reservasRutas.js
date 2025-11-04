// src/v1/rutas/reservasRutas.js
import express from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import autorizarUsuarios from '../../middlewares/autorizarUsuarios.js';
import ReservasControlador from '../../controladores/reservasControlador.js';

const reservasControlador = new ReservasControlador();
const router = express.Router();

// 1=Admin, 2=Empleado, 3=Cliente
router.get('/informe', autorizarUsuarios([1]), reservasControlador.informe);  
router.get('/:reserva_id',  autorizarUsuarios([1,2,3]), reservasControlador.buscarPorId);
router.get('/',  autorizarUsuarios([1,2,3]), reservasControlador.buscarTodos);

// Solo Admin y Cliente pueden crear
router.post('/', autorizarUsuarios([1,3]), 
    [
        check('fecha_reserva', 'La fecha es necesaria.').notEmpty(),
        check('salon_id', 'El salón es necesario.').notEmpty(),
        check('turno_id', 'El turno es necesario.').notEmpty(),  
        check('servicios', 'Faltan los servicios de la reserva.')
            .notEmpty()
            .isArray(),
        check('servicios.*.importe')
            .isFloat() 
            .withMessage('El importe debe ser numérico.'),   
        validarCampos
    ],
    reservasControlador.crear
);

// Solo Admin
router.put('/:reserva_id',
    autorizarUsuarios([1]), 
    [
        check('fecha_reserva').optional().isISO8601().withMessage('Formato de fecha inválido.'),
        check('salon_id').optional().isInt(),
        check('usuario_id').optional().isInt(),
        check('turno_id').optional().isInt(),
        validarCampos
    ],
    reservasControlador.modificar
);

// Solo Admin
router.delete('/:reserva_id',
    autorizarUsuarios([1]), 
    reservasControlador.eliminar 
)
export { router };