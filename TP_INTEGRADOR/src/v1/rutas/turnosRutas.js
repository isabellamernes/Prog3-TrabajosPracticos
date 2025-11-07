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


/**
 * @swagger
 * tags:
 *   name: Turnos
 *   description: Endpoints para los turnos disponibles
 */

/**
 * @swagger
 * /turnos:
 *   get:
 *     summary: Listar todos los turnos
 *     tags: [Turnos]
 *     responses:
 *       200:
 *         description: Lista de turnos
 *   post:
 *     summary: Crear nuevo turno
 *     tags: [Turnos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               horario:
 *                 type: string
 *                 example: "14:00:00 a 16:00:00"
 *               orden:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Turno creado correctamente
 * 
 * /turnos/{turno_id}:
 *   get:
 *     summary: Buscar turno por ID
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: turno_id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Turno encontrado
 *   put:
 *     summary: Modificar turno
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: turno_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               horario:
 *                 type: string
 *                 example: "16:00:00 a 18:00:00"
 *     responses:
 *       200:
 *         description: Turno modificado
 *   delete:
 *     summary: Eliminar turno por ID
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: turno_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Turno eliminado
 */










export { router };