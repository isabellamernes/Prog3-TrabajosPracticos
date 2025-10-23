// src/v1/rutas/authRutas.js
import { Router } from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import AuthControlador from '../../controllers/authControlador.js'; 

const controlador = new AuthControlador();
const router = Router();

// Ruta POST para Login
router.post('/auth/login', // Usamos el prefijo /auth/ para agrupar rutas de autenticación
    [
        check('nombre_usuario', 'El nombre de usuario es requerido.').notEmpty().isString(),
        check('contrasenia', 'La contraseña es requerida.').notEmpty().isString(),
        validarCampos 
    ],
    controlador.login 
);

export default router;