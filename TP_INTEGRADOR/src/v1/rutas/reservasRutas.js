// src/v1/rutas/reservasRutas.js
import express from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import autorizarUsuarios from '../../middlewares/autorizarUsuarios.js';
import ReservasControlador from '../../controladores/reservasControlador.js';
import { upload } from '../../middlewares/subirArchivo.js';

const reservasControlador = new ReservasControlador();
const router = express.Router();

// 1=Admin, 2=Empleado, 3=Cliente
router.get('/informe', autorizarUsuarios([1]), reservasControlador.informe);
router.get('/estadisticas', autorizarUsuarios([1]), reservasControlador.estadisticas);  
router.get('/:reserva_id',  autorizarUsuarios([1,2,3]), reservasControlador.buscarPorId);
router.get('/',  autorizarUsuarios([1,2,3]), reservasControlador.buscarTodos);


// Nota: usamos validación SIMPLE aquí: verificamos que 'datos' exista (JSON en form-data).

router.post(
  '/',
  autorizarUsuarios([1,3]),
  upload.single('foto_cumpleaniero'),     // multer primero
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
);



/**
 * @swagger
 * tags:
 *   name: Reservas
 *   description: Endpoints de reservas
 */

/**
 * @swagger
 * /reservas:
 *   get:
 *     summary: Listar todas las reservas
 *     tags: [Reservas]
 *     responses:
 *       200:
 *         description: Lista de reservas
 * 
 *   post:
 *     summary: Crear nueva reserva con foto opcional
 *     tags: [Reservas]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               datos:
 *                 type: string
 *                 description: JSON en una línea con los datos de la reserva
 *                 example: '{"fecha_reserva":"2025-12-10","salon_id":2,"turno_id":1,"tematica":"Star Wars","importe_salon":50000,"importe_total":65000,"servicios":[{"servicio_id":1,"importe":8000},{"servicio_id":2,"importe":7000}]}'
 *               foto_cumpleaniero:
 *                 type: string
 *                 format: binary
 *                 description: Foto del cumpleañero
 *     responses:
 *       200:
 *         description: Reserva creada correctamente
 */

/**
 * @swagger
 * /reservas/{reserva_id}:
 *   get:
 *     summary: Obtener una reserva por ID
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: reserva_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la reserva
 *     responses:
 *       200:
 *         description: Reserva encontrada
 *       404:
 *         description: Reserva no encontrada
 * 
 *   put:
 *     summary: Modificar reserva por ID
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: reserva_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la reserva
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fecha_reserva:
 *                 type: string
 *                 example: "2025-12-11"
 *               tematica:
 *                 type: string
 *                 example: "Fiesta Pirata"
 *     responses:
 *       200:
 *         description: Reserva modificada
 *       404:
 *         description: Reserva no encontrada
 * 
 *   delete:
 *     summary: Eliminar reserva por ID
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: reserva_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la reserva
 *     responses:
 *       200:
 *         description: Reserva eliminada
 *       404:
 *         description: Reserva no encontrada
 */





export { router };
