import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import handlebars from 'handlebars';

export default class NotificacionesService {
  enviarCorreo = async (datosCorreo) => {
    try {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);

      const plantillaPath = path.join(__dirname, '../utiles/handlebars/plantilla.hbs');
      const plantilla = fs.readFileSync(plantillaPath, 'utf-8');

      const template = handlebars.compile(plantilla);
      const correoHtml = template({
        fecha: datosCorreo.fecha,
        salon: datosCorreo.salon,
        turno: datosCorreo.turno,
        hora_desde: datosCorreo.hora_desde,
        hora_hasta: datosCorreo.hora_hasta,
      });

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.CORREO,
          pass: process.env.CLAVE,
        },
      });

      await transporter.sendMail({
        to: 'micawebdev@gmail.com',      
        subject: 'Nueva Reserva',
        html: correoHtml,
      });

      return true;
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      return false;
    }
  };

  // Estos métodos van fuera de enviarCorreo y como miembros de la clase
  enviarMensaje = async (_datos) => {};
  enviarWhatsapp = async (_datos) => {};
  enviarNotificationPush = async (_datos) => {};
}
