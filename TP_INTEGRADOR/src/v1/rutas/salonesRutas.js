import express from 'express';
import apicache from 'apicache';
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import autorizarUsuarios from '../../middlewares/autorizarUsuarios.js'; 
import SalonesControlador from '../../controladores/salonesControlador.js';

const salonesControlador = new SalonesControlador();
const router = express.Router();
let cache = apicache.middleware;

// 1=Admin, 2=Empleado, 3=Cliente
// Listar (Todos los roles)
router.get('/', cache('5 minutes'), autorizarUsuarios([1, 2, 3]), salonesControlador.buscarTodos); 
router.get('/:salon_id', autorizarUsuarios([1, 2, 3]), salonesControlador.buscarPorID);

// Modificar (Admin y Empleado)
router.put('/:salon_id', 
    autorizarUsuarios([1, 2]), 
    [
        check('titulo').optional().notEmpty(),
        check('direccion').optional().notEmpty(),
        check('capacidad').optional().isInt(), 
        check('importe').optional().isFloat(),
        check('latitud').optional().isFloat(),
        check('longitud').optional().isFloat(),
        validarCampos
    ],
    salonesControlador.modificar
);



// Crear (Admin y Empleado)
router.post('/', 
    autorizarUsuarios([1, 2]), 
    [
        check('titulo', 'El título es necesario.').notEmpty(),
        check('direccion', 'La dirección es necesaria.').notEmpty(),
        check('capacidad', 'La capacidad es necesaria.').notEmpty().isInt(), 
        check('importe', 'El importe es necesario.').notEmpty().isFloat(), 
        check('latitud').optional().isFloat(), 
        check('longitud').optional().isFloat(),
        validarCampos    
    ],
    salonesControlador.crear
);

// Eliminar (Admin y Empleado)
router.delete('/:salon_id', 
    autorizarUsuarios([1, 2]), 
    salonesControlador.eliminar
);


/**
 * @swagger
 * tags:
 *   name: Salones
 *   description: Endpoints de salones
 */

/**
 * @swagger
 * /salones:
 *   get:
 *     summary: Listar todos los salones
 *     tags: [Salones]
 *     responses:
 *       200:
 *         description: Lista de salones
 * 
 *   post:
 *     summary: Crear un nuevo salón
 *     tags: [Salones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: "Salón Principal"
 *               capacidad:
 *                 type: integer
 *                 example: 50
 *     responses:
 *       200:
 *         description: Salón creado
 */

/**
 * @swagger
 * /salones/{salon_id}:
 *   get:
 *     summary: Obtener un salón por ID
 *     tags: [Salones]
 *     parameters:
 *       - in: path
 *         name: salon_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del salón
 *     responses:
 *       200:
 *         description: Salón encontrado
 *       404:
 *         description: Salón no encontrado
 * 
 *   put:
 *     summary: Modificar un salón por ID
 *     tags: [Salones]
 *     parameters:
 *       - in: path
 *         name: salon_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del salón
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: "Salón Secundario"
 *               capacidad:
 *                 type: integer
 *                 example: 30
 *     responses:
 *       200:
 *         description: Salón modificado
 *       404:
 *         description: Salón no encontrado
 * 
 *   delete:
 *     summary: Eliminar un salón por ID
 *     tags: [Salones]
 *     parameters:
 *       - in: path
 *         name: salon_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del salón
 *     responses:
 *       200:
 *         description: Salón eliminado
 *       404:
 *         description: Salón no encontrado
 */





export { router };