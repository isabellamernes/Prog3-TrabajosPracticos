// src/routes/reservas.routes.js
import { Router } from 'express';
import { notificarReserva } from '../controllers/reserva.controller.js';

const router = Router();

// Endpoint para enviar la notificación de una reserva específica
// Ej: POST /api/reservas/5/notificar
router.post('/reservas/:reserva_id/notificar', notificarReserva);

export default router;