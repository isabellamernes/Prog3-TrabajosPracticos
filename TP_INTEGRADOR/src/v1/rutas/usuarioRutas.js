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

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Endpoints para gestión de usuarios
 */

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Listar todos los usuarios
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *   post:
 *     summary: Crear nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_usuario:
 *                 type: string
 *                 example: "Juan Pérez"
 *               email:
 *                 type: string
 *                 example: "juan@mail.com"
 *               contrasena:
 *                 type: string
 *                 example: "123456"
 *               tipo_usuario:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Usuario creado correctamente
 * 
 * /usuarios/{usuario_id}:
 *   get:
 *     summary: Obtener usuario por ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *   put:
 *     summary: Modificar usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_usuario:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario modificado
 *   delete:
 *     summary: Eliminar usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario eliminado
 */




export { router };