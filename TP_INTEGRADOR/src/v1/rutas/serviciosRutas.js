import express from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import autorizarUsuarios from '../../middlewares/autorizarUsuarios.js';
import ServiciosControlador from '../../controladores/serviciosControlador.js';

const controlador = new ServiciosControlador();
const router = express.Router();


// 1=Admin, 2=Empleado, 3=Cliente
router.get('/', autorizarUsuarios([1, 2, 3]), controlador.buscarTodos);
router.get('/:servicio_id', autorizarUsuarios([1, 2, 3]), controlador.buscarPorID);

router.post('/', 
    autorizarUsuarios([1, 2]),
    [
        check('descripcion', 'La descripción es necesaria.').notEmpty(),
        check('importe', 'El importe es necesario y debe ser numérico.').notEmpty().isFloat({ min: 0 }),
        validarCampos
    ],
    controlador.crear
);

router.put('/:servicio_id', 
    autorizarUsuarios([1, 2]),
    [
        check('descripcion').optional().notEmpty().withMessage('La descripción no puede estar vacía.'),
        check('importe').optional().isFloat({ min: 0 }).withMessage('El importe debe ser numérico.'),
        validarCampos
    ],
    controlador.modificar
);

router.delete('/:servicio_id', 
    autorizarUsuarios([1, 2]), 
    controlador.eliminar
);

/**
 * @swagger
 * tags:
 *   name: Servicios
 *   description: Endpoints para gestionar los servicios adicionales
 */

/**
 * @swagger
 * /servicios:
 *   get:
 *     summary: Listar todos los servicios
 *     tags: [Servicios]
 *     responses:
 *       200:
 *         description: Lista de servicios
 *   post:
 *     summary: Crear un nuevo servicio
 *     tags: [Servicios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descripcion:
 *                 type: string
 *                 example: "DJ en vivo"
 *               importe:
 *                 type: number
 *                 example: 12000
 *     responses:
 *       200:
 *         description: Servicio creado correctamente
 * 
 * /servicios/{servicio_id}:
 *   get:
 *     summary: Obtener servicio por ID
 *     tags: [Servicios]
 *     parameters:
 *       - in: path
 *         name: servicio_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Servicio encontrado
 *       404:
 *         description: No encontrado
 *   put:
 *     summary: Modificar servicio por ID
 *     tags: [Servicios]
 *     parameters:
 *       - in: path
 *         name: servicio_id
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
 *               descripcion:
 *                 type: string
 *               importe:
 *                 type: number
 *     responses:
 *       200:
 *         description: Servicio modificado
 *   delete:
 *     summary: Eliminar servicio por ID
 *     tags: [Servicios]
 *     parameters:
 *       - in: path
 *         name: servicio_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Servicio eliminado
 */




export { router };