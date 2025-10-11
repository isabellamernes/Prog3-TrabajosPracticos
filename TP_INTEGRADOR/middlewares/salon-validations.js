// middlewares/salon-validations.js (Corregido)

import { check, validationResult } from 'express-validator';

export const validarCampos = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};


export const validacionesPostSalon = [
    check('titulo', 'El título es obligatorio y debe ser un texto.').not().isEmpty().isString(),
    check('direccion', 'La dirección es obligatoria y debe ser un texto.').not().isEmpty().isString(),
    check('importe', 'El importe es obligatorio y debe ser un número decimal positivo.').isFloat({ gt: 0 }),
    check('capacidad', 'La capacidad debe ser un número entero.').optional().isInt({ gt: 0 }),
    validarCampos
];


export const validacionesPutSalon = [
    check('titulo', 'El título debe ser un texto.').optional().isString(),
    check('direccion', 'La dirección debe ser un texto.').optional().isString(),
    check('importe', 'El importe debe ser un número decimal positivo.').optional().isFloat({ gt: 0 }),
    check('capacidad', 'La capacidad debe ser un número entero.').optional().isInt({ gt: 0 }),
    check('activo', 'No se permite modificar el campo activo directamente en esta ruta.').not().exists(),
    validarCampos
];