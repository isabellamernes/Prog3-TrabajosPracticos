// src/servidor.js
import app from './app.js'; 
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Obtener el puerto
const PUERTO = process.env.PUERTO;

// Iniciar el servidor
app.listen(PUERTO, () => {
    console.log(`🚀 Servidor iniciado en el puerto ${PUERTO}`);
});