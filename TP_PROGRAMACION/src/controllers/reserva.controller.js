// src/controllers/reserva.controller.js
import * as ReservaModel from '../models/reserva.model.js';
import { enviarCorreo } from '../utils/mailer.js';

/**
 * Controlador para enviar una notificación por correo de una reserva existente.
 */
export const notificarReserva = async (req, res) => {
    try {
        const { reserva_id } = req.params;

        // 1. Buscar los datos completos de la reserva
        const reserva = await ReservaModel.getByIdCompleto(reserva_id);

        // 2. Verificar si la reserva existe
        if (!reserva) {
            return res.status(404).json({ 
                estado: false, 
                mensaje: 'La reserva no fue encontrada.' 
            });
        }

        // 3. Preparar los datos para la plantilla del correo
        const datosCorreo = {
            fecha: new Date(reserva.fecha_reserva).toLocaleDateString(),
            salon: reserva.salon_titulo,
            turno: `de ${reserva.hora_desde} a ${reserva.hora_hasta}`,
            correoDestino: reserva.usuario_correo // El correo del cliente que hizo la reserva
        };

        // 4. Llamar a la función para enviar el correo
        await enviarCorreo(datosCorreo);

        // 5. Enviar respuesta de éxito al cliente
        res.status(200).json({
            estado: true,
            mensaje: `Notificación para la reserva ${reserva_id} enviada a ${reserva.usuario_correo}.`
        });

    } catch (error) {
        console.error('Error al notificar la reserva:', error);
        res.status(500).json({ 
            estado: false, 
            mensaje: 'Error interno del servidor.' 
        });
    }
};