// src/services/notificacionesServicio.js
import nodemailer from 'nodemailer';
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import handlebars from 'handlebars';
import dotenv from 'dotenv';

dotenv.config();

export default class NotificacionesService {

    enviarCorreo = async (datosCorreo) => {
        try {
            const { fecha, salon, turno, correoDestino } = datosCorreo;

            // 1. Obtener la ruta de la plantilla
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename);
            // La plantilla ahora está en utiles/handlebars/
            const plantillaPath = path.join(__dirname, '../utiles/handlebars/plantilla.hbs');

            // 2. Leer y compilar la plantilla Handlebars
            const archivoHbs = await readFile(plantillaPath, 'utf-8');
            const template = handlebars.compile(archivoHbs);
            const html = template({ fecha, salon, turno });

            // 3. Configurar el "transporter" de Nodemailer
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_USER, // Tu usuario de gmail en .env
                    pass: process.env.EMAIL_PASSWORD, // Tu contraseña de aplicación en .env
                },
            });

            // 4. Definir las opciones del correo
            const opciones = {
                //to: correoDestino,
                to: "eileenmernes@gmail.com",
                subject: '✅ Notificación de Nueva Reserva',
                html: html
            };

            // 5. Enviar el correo
            await transporter.sendMail(opciones);
            
            console.log('Correo de notificación enviado exitosamente a:', correoDestino);
            return { ok: true, mensaje: 'Correo enviado.' };

        } catch (error) {
            console.error("Error al enviar el correo de notificación:", error);
            throw new Error('Error al enviar el correo.');
        }
    }
}