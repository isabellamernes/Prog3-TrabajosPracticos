import express from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import autorizarUsuarios from '../../middlewares/autorizarUsuarios.js';
import UsuariosControlador from '../../controladores/usuarioControlador.js';

const controlador = new UsuariosControlador();
const router = express.Router();

// 1=Admin. Solo el Admin puede gestionar usuarios.
router.get('/', autorizarUsuarios([1]), controlador.buscarTodos);
router.get('/:usuario_id', autorizarUsuarios([1]), controlador.buscarPorID);

router.post('/', 
    autorizarUsuarios([1]),
    [
        check('nombre', 'El nombre es necesario.').notEmpty(),
        check('apellido', 'El apellido es necesario.').notEmpty(),
        check('nombre_usuario', 'El nombre_usuario (email) es necesario.').notEmpty().isEmail(),
        check('contrasenia', 'La contraseña es necesaria.').notEmpty(),
        check('tipo_usuario', 'El tipo_usuario (rol) es necesario.').notEmpty().isInt(),
        validarCampos
    ],
    controlador.crear
);

router.put('/:usuario_id', 
    autorizarUsuarios([1]),
    [
        check('nombre_usuario').optional().isEmail().withMessage('Debe ser un email válido.'),
        check('tipo_usuario').optional().isInt().withMessage('Debe ser un ID de rol numérico.'),
        validarCampos
    ],
    controlador.modificar
);

router.delete('/:usuario_id', 
    autorizarUsuarios([1]), 
    controlador.eliminar
);

export { router };