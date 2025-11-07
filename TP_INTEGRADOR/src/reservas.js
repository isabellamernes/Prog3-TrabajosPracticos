import express from 'express';
import { swaggerDocs } from './config/swagger.js';
import passport from 'passport';
import morgan from 'morgan';
import fs from 'fs';

import { estrategia, validacion } from './config/passport.js';

import { router as v1AuthRutas } from './v1/rutas/authRutas.js';
import { router as v1SalonesRutas } from './v1/rutas/salonesRutas.js';
import { router as v1ReservasRutas } from './v1/rutas/reservasRutas.js';
import { router as v1ServiciosRutas } from './v1/rutas/serviciosRutas.js';
import { router as v1TurnosRutas } from './v1/rutas/turnosRutas.js';
import { router as v1UsuariosRutas } from './v1/rutas/usuarioRutas.js'; 

import uploadRutas from './v1/rutas/uploadRutas.js';

const app = express();

app.use(express.json());

passport.use(estrategia);
passport.use(validacion);
app.use(passport.initialize());

app.use('/uploads', express.static('uploads'));

let log = fs.createWriteStream('./access.log', { flags: 'a' })
app.use(morgan('combined')) 
app.use(morgan('combined', { stream: log })) 

// Ruta pública
app.use('/api/v1/auth', v1AuthRutas); 

// Integrar Swagger
swaggerDocs(app);

// Rutas protegidas (requieren token JWT)
app.use(passport.authenticate('jwt', { session: false }));

app.use('/api/v1/salones', v1SalonesRutas);
app.use('/api/v1/reservas', v1ReservasRutas);
app.use('/api/v1/servicios', v1ServiciosRutas); 
app.use('/api/v1/turnos', v1TurnosRutas);     
app.use('/api/v1/usuarios', v1UsuariosRutas);


app.use('/api/v1/upload', uploadRutas);


export default app;