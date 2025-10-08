// En un archivo: middlewares/salon-validations.js

import { check, validationResult } from 'express-validator';

// Middleware que recolecta y responde con los errores de validación
export const validarCampos = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Validaciones para la creación (Add - POST)
export const salonPostValidations = [
    check('titulo', 'El título es obligatorio y debe ser un texto.').not().isEmpty().isString(),
    check('direccion', 'La dirección es obligatoria y debe ser un texto.').not().isEmpty().isString(),
    check('importe', 'El importe es obligatorio y debe ser un número decimal positivo.').isFloat({ gt: 0 }),
    // Validaciones opcionales
    check('capacidad', 'La capacidad debe ser un número entero.').optional().isInt({ gt: 0 }),
    check('latitud', 'La latitud debe ser un valor decimal válido.').optional().isDecimal(),
    check('longitud', 'La longitud debe ser un valor decimal válido.').optional().isDecimal(),
    validarCampos // Manejador de errores
];

// Validaciones para la modificación (Edit - PUT)
export const salonPutValidations = [
    // Todos son opcionales en PUT, pero si se envían, deben ser válidos
    check('titulo', 'El título debe ser un texto.').optional().isString(),
    check('direccion', 'La dirección debe ser un texto.').optional().isString(),
    check('importe', 'El importe debe ser un número decimal positivo.').optional().isFloat({ gt: 0 }),
    check('capacidad', 'La capacidad debe ser un número entero.').optional().isInt({ gt: 0 }),
    check('latitud', 'La latitud debe ser un valor decimal válido.').optional().isDecimal(),
    check('longitud', 'La longitud debe ser un valor decimal válido.').optional().isDecimal(),
    // Excluir la manipulación directa de 'activo' por la ruta PUT de edición
    check('activo', 'No se permite modificar el campo activo directamente en esta ruta.').not().exists(),
    validarCampos
];