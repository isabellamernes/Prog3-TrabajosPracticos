// src/v1/rutas/reservasRutas.js
import { Router } from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
// Importamos los middlewares de autenticación/autorización
import { autenticar, autorizar } from '../../middlewares/authMiddleware.js'; // Asegúrate que la ruta sea correcta
import ReservasControlador from '../../controllers/reservasControlador.js'; // Asegúrate que la ruta sea correcta

const controlador = new ReservasControlador();
const router = Router();

// --- Rutas GET ---
// GET /reservas/:id: Solo Admin (según BREAD completo)
router.get('/reservas/:reserva_id',
    autenticar,
    autorizar(['Administrador']),
    controlador.buscarPorId
);

// GET /reservas: Accesible para Cliente, Empleado, Admin
router.get('/reservas',
    autenticar, // Todos necesitan estar logueados para ver reservas
    // No necesita 'autorizar' específico si todos los autenticados pueden acceder
    controlador.buscarTodos
);

// --- Rutas de Reportes ---
// GET /reservas/reporte/csv: Solo Admin
router.get('/reservas/reporte/csv',
    autenticar,
    autorizar(['Administrador']),
    controlador.descargarReporteCSV
);

// GET /reservas/reporte/pdf: Solo Admin
router.get('/reservas/reporte/pdf',
    autenticar,
    autorizar(['Administrador']),
    controlador.descargarReportePDF
);

// --- Ruta POST para Crear ---
// POST /reservas: Solo Cliente
router.post('/reservas',
    autenticar,
    autorizar(['Cliente']), // Solo Clientes pueden crear reservas
    [ // Validaciones
        check('fecha_reserva', 'La fecha es necesaria.').notEmpty().isISO8601().toDate(),
        check('salon_id', 'El salón es necesario.').notEmpty().isInt({ min: 1}),
        // check('usuario_id', 'El usuario es necesario.')... // No validamos usuario_id aquí, lo tomaremos del token!
        check('turno_id', 'El turno es necesario.').notEmpty().isInt({ min: 1}),
        check('foto_cumpleaniero').optional().isString(),
        check('tematica').optional().isString(),
        check('importe_total', 'Importe total debe ser numérico').notEmpty().isFloat({ min: 0 }),
        check('servicios', 'Servicios debe ser un array (puede estar vacío).').isArray(),
        check('servicios.*.servicio_id', 'Cada servicio debe tener servicio_id').if(check('servicios').exists({checkFalsy: false})).isInt({ min: 1}),
        check('servicios.*.importe', 'El importe de cada servicio debe ser numérico').if(check('servicios').exists({checkFalsy: false})).isFloat({ min: 0 }),
        validarCampos
    ],
    // TO DO: Modificar controlador.crear para que use req.user.id en lugar de req.body.usuario_id
    controlador.crear
);

// --- Ruta PUT para Modificar ---
// PUT /reservas/:id: Solo Admin
router.put('/reservas/:reserva_id',
    autenticar,
    autorizar(['Administrador']), // Solo Admin puede modificar
    [ // Validaciones
      check('fecha_reserva').optional().isISO8601().toDate(),
      check('turno_id').optional().isInt({ min: 1}),
      check('foto_cumpleaniero').optional().isString(),
      check('tematica').optional().isString(),
      check('importe_total').optional().isFloat({ min: 0 }),
      validarCampos
    ],
    controlador.modificar
);

// --- Ruta DELETE para Eliminar ---
// DELETE /reservas/:id: Solo Admin
router.delete('/reservas/:reserva_id',
    autenticar,
    autorizar(['Administrador']), // Solo Admin puede eliminar
    controlador.eliminar
);

// --- Ruta POST para Notificar ---
// POST /reservas/:id/notificar: Asumimos Cliente (o quizás Admin/Empleado también?)
router.post('/reservas/:reserva_id/notificar',
    autenticar,
    // Podríamos añadir lógica para verificar si req.user.id coincide con reserva.usuario_id
    // O permitir a Admin/Empleado también: autorizar(['Cliente', 'Administrador', 'Empleado'])
    autorizar(['Cliente']), // Por ahora, solo el cliente
    controlador.notificarReserva
);

export default router;