// src/controllers/reservasControlador.js
import ReservasServicio from '../services/reservasServicio.js'; // Asegúrate que la ruta sea correcta

export default class ReservasControlador {

    constructor() {
        this.servicio = new ReservasServicio();
    }

    crear = async (req, res) => {
        try {
            // --- ¡CAMBIO IMPORTANTE AQUÍ! ---
            // Verificamos que req.user exista (lo añade el middleware 'autenticar')
            if (!req.user || !req.user.usuario_id) {
                 console.error("Error: req.user no está definido o no tiene usuario_id en reservasControlador.crear. ¿Se ejecutó el middleware 'autenticar'?");
                 return res.status(401).json({ estado: false, mensaje: 'Acceso no autorizado (usuario no identificado correctamente).' });
            }

            // Obtenemos el ID del usuario autenticado desde req.user
            // Asegúrate que la propiedad se llame 'usuario_id' en el payload de tu token JWT
            const usuarioIdAutenticado = req.user.usuario_id;

            // Combinamos los datos del body con el ID del usuario autenticado
            const datosReserva = {
                ...req.body, // Copiamos todos los datos del cuerpo (fecha, salon_id, turno_id, etc.)
                usuario_id: usuarioIdAutenticado // Sobrescribimos o añadimos el usuario_id correcto
            };
            // --- FIN DEL CAMBIO ---

            // Pasamos los datos combinados al servicio
            const nuevaReserva = await this.servicio.crear(datosReserva);

            res.status(201).json({
                estado: true,
                mensaje: 'Reserva creada y notificada!',
                reserva: nuevaReserva
            });
        } catch (err) {
            console.error('Error en POST /reservas/', err);
            res.status(500).json({
                estado: false,
                mensaje: err.message || 'Error interno del servidor.'
            });
        }
    }

    // --- Métodos buscarTodos, buscarPorId, modificar, eliminar, notificarReserva, descargarReporteCSV, descargarReportePDF (sin cambios) ---
    buscarTodos = async (req, res) => {
        try {
            const reservas = await this.servicio.buscarTodos();
            res.json({ estado: true, datos: reservas });
        } catch (err) {
            console.error('Error en GET /reservas', err);
            res.status(500).json({ estado: false, mensaje: 'Error interno del servidor.' });
        }
    }

    buscarPorId = async (req, res) => {
        try {
            const reserva_id = req.params.reserva_id;
            const reserva = await this.servicio.buscarPorId(reserva_id);
            if (!reserva) {
                return res.status(404).json({ estado: false, mensaje: 'Reserva no encontrada.' });
            }
            res.json({ estado: true, reserva: reserva });
        } catch (err) {
            console.error(`Error en GET /reservas/${req.params.reserva_id}`, err);
            res.status(500).json({ estado: false, mensaje: 'Error interno del servidor.' });
        }
    }

    modificar = async (req, res) => {
        try {
            const { reserva_id } = req.params;
            const datos = req.body;
            const reservaModificada = await this.servicio.modificar(reserva_id, datos);
            if (!reservaModificada) {
                return res.status(404).json({ estado: false, mensaje: 'Reserva no encontrada o sin cambios válidos.' });
            }
            res.status(200).json({ estado: true, mensaje: 'Reserva modificada exitosamente.', reserva: reservaModificada });
        } catch (error) {
            console.error(`Error en PUT /reservas/${req.params.reserva_id}:`, error);
            res.status(500).json({ estado: false, mensaje: 'Error interno del servidor al modificar la reserva.' });
        }
    }

    eliminar = async (req, res) => {
        try {
            const { reserva_id } = req.params;
            const exito = await this.servicio.eliminar(reserva_id);
            if (!exito) {
                 return res.status(404).json({ estado: false, mensaje: 'Reserva no encontrada o ya estaba inactiva.' });
            }
            res.status(200).json({ estado: true, mensaje: 'Reserva eliminada (desactivada) exitosamente.' });
        } catch (error) {
            console.error(`Error en DELETE /reservas/${req.params.reserva_id}:`, error);
            res.status(500).json({ estado: false, mensaje: 'Error interno del servidor al eliminar la reserva.' });
        }
    }

    notificarReserva = async (req, res) => {
        try {
            const { reserva_id } = req.params;
            const resultado = await this.servicio.notificarReservaPorId(reserva_id);
            if (!resultado) {
                return res.status(404).json({ estado: false, mensaje: 'La reserva no fue encontrada.' });
            }
            res.status(200).json({ estado: true, mensaje: `Notificación para la reserva ${resultado.reserva_id} enviada a ${resultado.correo}.` });
        } catch (error) {
            console.error('Error al notificar la reserva:', error);
            res.status(500).json({ estado: false, mensaje: 'Error interno del servidor.' });
        }
    }

    descargarReporteCSV = async (req, res) => {
        try {
            const nombreArchivo = `reporte_reservas_${new Date().toISOString().split('T')[0]}.csv`;
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}"`);
            const csvStream = await this.servicio.generarReporteCSV();
            csvStream.pipe(res);
        } catch (error) {
            console.error("Error en GET /reservas/reporte/csv:", error);
            res.status(500).json({ estado: false, mensaje: 'Error interno al generar el reporte CSV.' });
        }
    }

    descargarReportePDF = async (req, res) => {
        try {
            const nombreArchivo = `reporte_reservas_${new Date().toISOString().split('T')[0]}.pdf`;
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}"`);
            const pdfDoc = await this.servicio.generarReportePDF();
            pdfDoc.pipe(res);
        } catch (error) {
            console.error("Error en GET /reservas/reporte/pdf:", error);
            res.status(500).json({ estado: false, mensaje: 'Error interno al generar el reporte PDF.' });
        }
    }
}