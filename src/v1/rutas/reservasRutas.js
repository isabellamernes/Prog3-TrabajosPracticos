import express from 'express';
import apicache from 'apicache';
import { body, param } from 'express-validator';
import ReservasControlador from '../../controladores/reservasControlador.js';
import { validarCampos } from '../../middlewares/validarCampos.js';

const router = express.Router();
const reservasControlador = new ReservasControlador();

// POST /api/v1/reservas
router.post(
  '/',
  [
    body('fecha_reserva').isISO8601().withMessage('Fecha inválida').toDate(),
    body('salon_id').isInt({ gt: 0 }).withMessage('salon_id inválido').toInt(),
    body('usuario_id').isInt({ gt: 0 }).withMessage('usuario_id inválido').toInt(),
    body('turno_id').isInt({ gt: 0 }).withMessage('turno_id inválido').toInt(),
    body('foto_cumpleaniero').optional().isString().trim(),
    body('tematica').optional().isString().trim(),
    body('importe_salon').isFloat({ gt: 0 }).withMessage('importe_salon inválido').toFloat(),
    body('importe_total').isFloat({ gt: 0 }).withMessage('importe_total inválido').toFloat(),
    body('servicios').isArray({ min: 1 }).withMessage('Faltan los servicios de la reserva.'),
    body('servicios.*.servicio_id').isInt({ gt: 0 }).withMessage('servicio_id inválido').toInt(),
    body('servicios.*.importe').isFloat({ gt: 0 }).withMessage('importe de servicio inválido').toFloat(),
  ],
  validarCampos,
  reservasControlador.crear
);

// GET /api/v1/reservas  -> listar todas
router.get('/', async (req, res) => {
  try {
    const data = await reservasControlador.reservasServicio.buscarTodos();
    res.json({ estado: true, datos: data });
  } catch (e) {
    res.status(500).json({ estado: false, mensaje: 'Error al listar' });
  }
});


// GET /api/v1/reservas/:id
router.get(
  '/:id',
  [param('id').isInt({ gt: 0 }).toInt(), validarCampos],
  async (req, res) => {
    try {
      const data = await reservasControlador.reservasServicio.buscarPorId(req.params.id);
      if (!data) return res.status(404).json({ estado: false, mensaje: 'No encontrada' });
      res.json({ estado: true, datos: data });
    } catch (e) {
      res.status(500).json({ estado: false, mensaje: 'Error al buscar' });
    }
  }
);

export { router };
