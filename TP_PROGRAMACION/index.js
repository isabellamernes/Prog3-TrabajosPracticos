// index.js

// Importaciones de módulos
import express from 'express';
import dotenv from 'dotenv';

// --- IMPORTACIÓN DE RUTAS DE LA API ---
// Cada archivo de rutas se encarga de un "recurso" o "entidad" diferente.
import salonRoutes from './src/routes/salones.routes.js';
import reservaRoutes from './src/routes/reservas.routes.js'; // <-- ¡NUEVA LÍNEA!

// --- CONFIGURACIÓN INICIAL ---

// Cargar variables de entorno desde el archivo .env
dotenv.config();

// Crear una instancia de Express
const app = express();

// --- MIDDLEWARES ---

// Interpretar las solicitudes que vienen con un cuerpo en formato JSON
app.use(express.json());

// --- RUTAS ---

// Ruta para verificar el estado de la API (muy útil para monitoreo)
app.get('/estado', (req, res) => {
    res.json({ 'ok': true });
});

// Le decimos a nuestra aplicación que use las rutas que hemos importado.
// Todas las rutas comenzarán con el prefijo /api para mantener un estándar.
app.use('/api', salonRoutes);
app.use('/api', reservaRoutes); // <-- ¡NUEVA LÍNEA!

// --- INICIO DEL SERVIDOR ---

// Obtener el puerto de las variables de entorno o usar 3000 como valor por defecto
const PUERTO = process.env.PUERTO;

// Iniciar el servidor y escuchar en el puerto especificado
app.listen(PUERTO, () => {
    console.log(`🚀 Servidor iniciado en el puerto ${PUERTO}`);
});