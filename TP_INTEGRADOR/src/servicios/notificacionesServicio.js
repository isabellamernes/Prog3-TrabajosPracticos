import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import handlebars from 'handlebars';

export default class NotificacionesServicio {
    constructor() {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        const plantillaPath = path.join(__dirname, '../utiles/handlebars/plantilla.hbs');
        const plantilla = fs.readFileSync(plantillaPath, 'utf-8');
        this.template = handlebars.compile(plantilla);

        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.CORREO,
                pass: process.env.CLAVE,
            }
        });
    }

    /**
     * datosCorreo viene de:
     * 
     *   const sql = 'CALL obtenerDatosNotificacion(?)';
     *   const [reserva] = await conexion.execute(sql, [reserva_id]);
     *   return reserva;
     * 
     * Estructura esperada:
     *   datosCorreo[0] = [{ fecha, salon, turno, cliente, correoCliente }]
     *   datosCorreo[1] = [{ correoAdmin }, { correoAdmin }, ...]
     */
    enviarCorreo = async (datosCorreo) => {
        // Validación básica
        if (!Array.isArray(datosCorreo) || datosCorreo.length === 0) {
            console.log('Notificaciones: datosCorreo vacío, no se envía email.');
            return;
        }

        const reservas = Array.isArray(datosCorreo[0]) ? datosCorreo[0] : [];
        const admins   = Array.isArray(datosCorreo[1]) ? datosCorreo[1] : [];

        if (reservas.length === 0) {
            console.log('Notificaciones: sin datos de reserva, no se envía email.');
            return;
        }

        const fila = reservas[0];

        const datos = {
            fecha: fila.fecha,
            salon: fila.salon,
            turno: fila.turno,
            cliente: fila.cliente,
            correoCliente: fila.correoCliente
        };

        const correoHtml = this.template(datos);

        const correosAdmin = admins
            .map(a => a.correoAdmin)
            .filter(c => !!c);

        const correoCliente = fila.correoCliente || null;

        const destinatariosSet = new Set();

        correosAdmin.forEach(c => destinatariosSet.add(c));

        if (correoCliente) {
            destinatariosSet.add(correoCliente);
        }

        
        if (process.env.CORREO) {
            destinatariosSet.add(process.env.CORREO);
        }

        const destinatarios = Array.from(destinatariosSet).join(', ');

        const mailOptions = {
            from: process.env.CORREO,
            to: destinatarios,
            subject: 'Nueva Reserva',
            html: correoHtml
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Correo de reserva enviado a: ${destinatarios}`);
            return true;
        } catch (error) {
            console.log('Error enviando el correo de reserva:', error);
            throw error;
        }
    }
}
