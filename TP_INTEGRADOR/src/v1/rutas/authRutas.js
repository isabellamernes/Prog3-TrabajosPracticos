import express from 'express';
import AuthControlador from '../../controladores/authControlador.js';
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';

const router = express.Router();
const authControlador = new AuthControlador();

router.post('/login', 
    [
        check('nombre_usuario', 'El nombre_usuario es requerido!').not().isEmpty(),
        check('contrasenia', 'La contrasenia es requerida!').not().isEmpty(),
        validarCampos
    ], 
    authControlador.login
);

router.post('/register', 
    [
        check('nombre', 'El nombre es necesario.').notEmpty(),
        check('apellido', 'El apellido es necesario.').notEmpty(),
        check('nombre_usuario', 'El nombre_usuario (email) es necesario.').notEmpty().isEmail(),
        check('contrasenia', 'La contraseña es necesaria.').notEmpty(),
        validarCampos
    ], 
    authControlador.register
);





export { router };