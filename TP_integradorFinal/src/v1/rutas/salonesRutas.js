// src/v1/rutas/salonesRutas.js
import { Router } from 'express';
import { check } from 'express-validator';
import apicache from 'apicache';
import { validarCampos } from '../../middlewares/validarCampos.js';
// Importamos los nuevos middlewares de autenticación/autorización
import { autenticar, autorizar } from '../../middlewares/authMiddleware.js'; // Asegúrate que la ruta sea correcta
import SalonesControlador from '../../controllers/salonesControlador.js'; // Asegúrate que la ruta sea correcta

const controlador = new SalonesControlador();
const router = Router();
let cache = apicache.middleware;

// --- Rutas GET ---
// GET /salones: Accesible para todos los autenticados (Cliente, Empleado, Admin)
router.get('/salones',
    autenticar, // Requiere token válido
    cache('5 minutes'),
    controlador.getAllSalones
);

// GET /salones/:id: Accesible para Empleado y Admin
router.get('/salones/:salon_id',
    autenticar, // Requiere token
    autorizar(['Empleado', 'Administrador']), // Requiere rol Empleado o Admin
    controlador.getSalonById
);

// --- Ruta POST ---
// POST /salones: Accesible para Empleado y Admin
router.post('/salones',
    autenticar,
    autorizar(['Empleado', 'Administrador']),
    [ // Validaciones
        check('titulo', 'El título es necesario.').notEmpty(),
        check('direccion', 'La dirección es necesaria.').notEmpty(),
        check('latitud', 'La latitud es necesaria y debe ser numérica.').notEmpty().isFloat(),
        check('longitud', 'La longitud es necesaria y debe ser numérica.').notEmpty().isFloat(),
        check('capacidad', 'La capacidad es necesaria y debe ser numérica.').notEmpty().isInt({ min: 1 }),
        check('importe', 'El importe es necesario y debe ser numérico.').notEmpty().isFloat({ min: 0 }),
        validarCampos
    ],
    controlador.createSalon
);

// --- Ruta PUT ---
// PUT /salones/:id: Accesible para Empleado y Admin
router.put('/salones/:salon_id',
    autenticar,
    autorizar(['Empleado', 'Administrador']),
    [ // Validaciones
        check('titulo', 'El título es necesario.').notEmpty(),
        check('direccion', 'La dirección es necesaria.').notEmpty(),
        check('latitud', 'La latitud es necesaria y debe ser numérica.').notEmpty().isFloat(),
        check('longitud', 'La longitud es necesaria y debe ser numérica.').notEmpty().isFloat(),
        check('capacidad', 'La capacidad es necesaria y debe ser numérica.').notEmpty().isInt({ min: 1 }),
        check('importe', 'El importe es necesario y debe ser numérico.').notEmpty().isFloat({ min: 0 }),
        validarCampos
    ],
    controlador.updateSalon
);

// --- Ruta DELETE ---
// DELETE /salones/:id: Accesible para Empleado y Admin
router.delete('/salones/:salon_id',
    autenticar,
    autorizar(['Empleado', 'Administrador']),
    controlador.deleteSalon
);

export default router;