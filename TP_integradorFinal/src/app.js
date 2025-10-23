// src/app.js
import express from 'express';
import passport from 'passport';
import './config/passport.js';
// --- IMPORTACIÓN DE RUTAS ---
import salonRoutes from './v1/rutas/salonesRutas.js';
import reservaRoutes from './v1/rutas/reservasRutas.js';
import authRoutes from './v1/rutas/authRutas.js';

// Crear una instancia de Express
const app = express();

// --- MIDDLEWARES ---
app.use(express.json());
app.use(passport.initialize()); // <--- Inicializa Passport

// --- RUTAS ---
app.get('/estado', (req, res) => {
    res.json({ 'ok': true });
});

// Montamos las rutas 
app.use('/api/v1', authRoutes); 
app.use('/api/v1', salonRoutes);
app.use('/api/v1', reservaRoutes);

// Exportamos la app
export default app;