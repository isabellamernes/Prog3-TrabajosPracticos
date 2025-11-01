import express from 'express';
import apicache from 'apicache';
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import SalonesControlador from '../../controladores/salonesControlador.js';

const salonesControlador = new SalonesControlador();
const router = express.Router();
let cache = apicache.middleware;

// GET - con caché de 5 minutos
router.get('/', cache('5 minutes'), salonesControlador.buscarTodos);

router.get('/:salon_id', salonesControlador.buscarPorID);

// PUT - modificar salón (limpiar caché luego de modificar)
router.put('/:salon_id', async (req, res) => {
    await salonesControlador.modificar(req, res);
    apicache.clear(); // 🔄 Limpia toda la caché al actualizar datos
});

// POST - crear salón (limpiar caché luego de crear)
router.post(
    '/',
    [
        check('titulo', 'El título es necesario.').notEmpty(),
        check('direccion', 'La dirección es necesaria.').notEmpty(),
        check('capacidad', 'La capacidad es necesaria.').notEmpty() .isNumeric(),
        check('importe', 'El importe es necesario.').notEmpty() .isFloat({ min: 0 }),
        validarCampos
    ],
    async (req, res) => {
        await salonesControlador.crear(req, res);
        apicache.clear(); // 🔄 Limpia caché al crear un nuevo salón
    }
);

// DELETE - eliminar salón (limpiar caché luego de eliminar)
router.delete('/:salon_id', async (req, res) => {
    await salonesControlador.eliminar(req, res);
    apicache.clear(); // 🔄 Limpia caché al eliminar un salón
});

export { router };
