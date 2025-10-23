// src/services/reservasServicio.js
import { conexion } from '../db/conexion.js';
import Reservas from "../db/reservas.js";
import ReservasServicios from "../db/reservas_servicios.js";
import NotificacionesService from "./notificacionesServicio.js";
import dotenv from 'dotenv';
import PDFDocument from 'pdfkit';
import { format as formatCsv } from '@fast-csv/format';

dotenv.config(); 

export default class ReservasServicio {

    constructor(){
        this.reservasDB = new Reservas();
        this.reservasServiciosDB = new ReservasServicios();
        this.notificacionesServicio = new NotificacionesService();
        this.adminEmail = process.env.ADMIN_EMAIL;
    }

    buscarTodos = () => {
        return this.reservasDB.buscarTodos();
    }

    buscarPorId = (reserva_id) => {
        return this.reservasDB.buscarPorId(reserva_id);
    }

    crear = async (reservaData) => {
        const conn = await conexion.getConnection();
        try {
            const { servicios, ...nuevaReservaData } = reservaData;
            await conn.beginTransaction();
            const reservaId = await this.reservasDB.crear(conn, nuevaReservaData);
            if (!reservaId) throw new Error("No se pudo crear la reserva.");
            if (servicios && servicios.length > 0) {
                await this.reservasServiciosDB.crear(conn, reservaId, servicios);
            }
            await conn.commit();

            // --- Inicio Bloque de Notificaciones ---
            const datosNotificacion = await this.reservasDB.datosParaNotificacion(reservaId);

            if (datosNotificacion) {
                const fechaFormateada = new Date(datosNotificacion.fecha_reserva).toLocaleDateString();
                const turnoFormateado = `de ${datosNotificacion.hora_desde} a ${datosNotificacion.hora_hasta}`;

                // 5.a Notificación al CLIENTE
                try {
                    await this.notificacionesServicio.enviarCorreo({
                        fecha: fechaFormateada,
                        salon: datosNotificacion.salon_titulo,
                        turno: turnoFormateado,
                        correoDestino: datosNotificacion.usuario_correo // Correo del cliente
                    });
                } catch (emailError) {
                    console.error(`Reserva ${reservaId} creada, pero falló envío a cliente: ${emailError}`);
                }

                // 5.b Notificación al ADMINISTRADOR
                if (this.adminEmail) {
                    try {
                        await this.notificacionesServicio.enviarCorreo({
                            fecha: fechaFormateada,
                            salon: datosNotificacion.salon_titulo,
                            turno: turnoFormateado,
                            correoDestino: this.adminEmail,
                            // Opcional: Cambiar asunto para el admin
                            // subject: `[ADMIN] Nueva Reserva Creada #${reservaId}`
                        });
                         console.log(`Notificación de reserva ${reservaId} enviada también al administrador.`);
                    } catch (emailAdminError) {
                        console.error(`Reserva ${reservaId} creada, pero falló envío a admin: ${emailAdminError}`);
                    }
                } else {
                    console.warn(`Reserva ${reservaId} creada, pero no se configuró ADMIN_EMAIL en .env para notificar.`);
                }
            }

            return this.reservasDB.buscarPorId(reservaId);

        } catch (error) {
            await conn.rollback();
            console.error("Error al crear reserva (rollback aplicado):", error);
            throw new Error(`Error al crear la reserva: ${error.message}`);
        } finally {
            if (conn) conn.release();
        }
    }

    modificar = async (reserva_id, datos) => {
        const reservaExistente = await this.buscarPorId(reserva_id);
        if (!reservaExistente) {
            return null;
        }
        return this.reservasDB.modificar(reserva_id, datos);
    }

    eliminar = async (reserva_id) => {
        const filasAfectadas = await this.reservasDB.eliminar(reserva_id);
        return filasAfectadas > 0;
    }

    notificarReservaPorId = async (reserva_id) => {
        const reserva = await this.reservasDB.datosParaNotificacion(reserva_id);
        if (!reserva) {
            return null;
        }
        const datosCorreo = {
            fecha: new Date(reserva.fecha_reserva).toLocaleDateString(),
            salon: reserva.salon_titulo,
            turno: `de ${reserva.hora_desde} a ${reserva.hora_hasta}`,
            correoDestino: reserva.usuario_correo
        };

        await this.notificacionesServicio.enviarCorreo(datosCorreo);
        return {
            reserva_id: reserva_id,
            correo: reserva.usuario_correo
        };
    }

    /**
     * Genera un stream de datos en formato CSV con el reporte de reservas.
     * @returns {Promise<Stream>} Un stream CSV.
     */
    generarReporteCSV = async () => {
        try {
            const datos = await this.reservasDB.buscarDetallesParaReporte();

            // Creamos un stream CSV
            const csvStream = formatCsv({ headers: true });

            // Escribimos los datos en el stream
            datos.forEach(row => {
                 // Formateamos la fecha si es necesario (ej: DD/MM/YYYY)
                row.fecha_reserva = new Date(row.fecha_reserva).toLocaleDateString('es-AR');
                csvStream.write(row);
            });
            csvStream.end();

            return csvStream;

        } catch (error) {
            console.error("Error generando reporte CSV:", error);
            throw new Error('Error al generar el reporte CSV.');
        }
    }

    /**
     * Genera un stream de datos en formato PDF con el reporte de reservas.
     * @returns {Promise<PDFDocument>} Un stream/documento PDF.
     */
    generarReportePDF = async () => {
        try {
            const datos = await this.reservasDB.buscarDetallesParaReporte();
            const doc = new PDFDocument({ margin: 50, size: 'A4' });

            // --- Estilo Básico del PDF ---
            doc.fontSize(18).text('Reporte de Reservas Activas', { align: 'center' });
            doc.moveDown();

            // Encabezados de la tabla (simplificado)
            const headers = ['ID', 'Fecha', 'Cliente', 'Salón', 'Turno', 'Importe', 'Servicios'];
            const headerY = doc.y;
            const colWidth = (doc.page.width - 100) / headers.length; // Ancho aprox.
            headers.forEach((header, i) => {
                 doc.fontSize(10).fillColor('grey').text(header, 50 + i * colWidth, headerY, { width: colWidth, align: 'left' });
            });
            doc.moveDown(0.5);
            // Línea separadora
            doc.strokeColor('black').lineWidth(0.5).moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).stroke();
             doc.moveDown(0.5);

            // --- Filas de Datos ---
            datos.forEach(reserva => {
                const rowY = doc.y;
                const cliente = `${reserva.usuario_apellido}, ${reserva.usuario_nombre}`;
                const turno = `T${reserva.turno_orden} (${reserva.turno_hora_desde}-${reserva.turno_hora_hasta})`;
                const fecha = new Date(reserva.fecha_reserva).toLocaleDateString('es-AR');
                 // Manejo de servicios NULL o largos
                let servicios = reserva.servicios_contratados ? reserva.servicios_contratados.replace(/; /g, '\n') : 'Ninguno';

                doc.fontSize(8).fillColor('black'); // Reset color
                doc.text(reserva.reserva_id.toString(), 50, rowY, { width: colWidth });
                doc.text(fecha, 50 + colWidth, rowY, { width: colWidth });
                doc.text(cliente, 50 + 2 * colWidth, rowY, { width: colWidth });
                doc.text(reserva.salon_titulo, 50 + 3 * colWidth, rowY, { width: colWidth });
                doc.text(turno, 50 + 4 * colWidth, rowY, { width: colWidth });
                doc.text(`$${reserva.importe_total}`, 50 + 5 * colWidth, rowY, { width: colWidth });
                doc.text(servicios, 50 + 6 * colWidth, rowY, { width: colWidth });

                 // Avanzar cursor a la posición más baja de la fila actual + espacio
                doc.y = Math.max(doc.y, doc.heightOfString(servicios, { width: colWidth }) + rowY) + 10; // Añade espacio entre filas

                 // Salto de página si es necesario
                if (doc.y > doc.page.height - 50) {
                     doc.addPage();
                     // Podrías repetir encabezados aquí si quieres
                     doc.y = 50; // Reinicia Y en nueva página
                }
            });

            doc.end(); // Finaliza el documento PDF
            return doc; // Devolvemos el documento (que es un stream)

        } catch (error) {
            console.error("Error generando reporte PDF:", error);
            throw new Error('Error al generar el reporte PDF.');
        }
    }
}