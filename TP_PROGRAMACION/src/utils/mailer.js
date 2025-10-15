// src/utils/mailer.js

import handlebars from 'handlebars';
import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';
import { readFile } from 'fs/promises';
import path from 'path';

/**
 * Envía un correo electrónico utilizando una plantilla Handlebars.
 * @param {object} datos - Objeto con los datos para el correo.
 * @param {string} datos.fecha - La fecha de la reserva.
 * @param {string} datos.salon - El nombre del salón.
 * @param {string} datos.turno - El turno reservado.
 * @param {string} datos.correoDestino - El correo del destinatario.
 */
export const enviarCorreo = async (datos) => {
    try {
        const { fecha, salon, turno, correoDestino } = datos;

        // 1. Obtener la ruta de la plantilla
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const plantillaPath = path.join(__dirname, '..', '..', 'templates', 'plantilla.hbs');

        // 2. Leer y compilar la plantilla Handlebars
        const archivoHbs = await readFile(plantillaPath, 'utf-8');
        const template = handlebars.compile(archivoHbs);
        const html = template({ fecha, salon, turno });

        // 3. Configurar el "transporter" de Nodemailer
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.USER, // Tu usuario de gmail en .env
                pass: process.env.PASS, // Tu contraseña de aplicación en .env
            },
        });

        // 4. Definir las opciones del correo
        const opciones = {
            to: correoDestino,
            subject: '✅ Notificación de Nueva Reserva',
            html: html
        };

        // 5. Enviar el correo
        await transporter.sendMail(opciones);
        
        console.log('Correo de notificación enviado exitosamente a:', correoDestino);
        return { ok: true, mensaje: 'Correo enviado.' };

    } catch (error) {
        console.error("Error al enviar el correo de notificación:", error);
        return { ok: false, mensaje: 'Error al enviar el correo.' };
    }
};