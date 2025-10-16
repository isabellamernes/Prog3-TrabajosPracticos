import nodemailer from 'nodemailer';
import 'dotenv/config';

export const enviarMail = async (para, asunto, mensajeHTML) => {
  try {
    // Configura el transporte (puede ser Gmail, Outlook, etc.)
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: true,
      auth: {
        user: process.env.USERCORREO, //  correo
        pass: process.env.PASSCORREO, //  contraseña o app password
      },
    });

    // Datos del correo
    const mailOptions = {
      from: `"Sistema de Reservas" <${process.env.USERCORREO}>`,
      to: para,
      subject: asunto,
      html: mensajeHTML,
    };

    // Enviar correo
    const info = await transporter.sendMail(mailOptions);
    console.log(' Email enviado:', info.messageId);
    return true;
  } catch (error) {
    console.error(' Error al enviar correo:', error);
    return false;
  }
};


