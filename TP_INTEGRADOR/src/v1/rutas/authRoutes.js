import express from 'express';
import AuthController from '../../controladores/authController.js';
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';

const router = express.Router();
const authController = new AuthController();

router.post('/login', 
    [
        // El profe en la Semana 12 valida como email
        check('nombre_usuario', 'El nombre_usuario es requerido!').not().isEmpty(),
        check('contrasenia', 'La contrasenia es requerida!').not().isEmpty(),
        validarCampos
    ], 
    authController.login);

export { router };