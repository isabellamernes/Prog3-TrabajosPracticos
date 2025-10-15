// src/models/reserva.model.js
import { conexion } from '../../db/conexion.js';

/**
 * Busca una reserva por su ID y une los datos de las tablas relacionadas.
 * @param {number} reserva_id - El ID de la reserva a buscar.
 * @returns {object|undefined} El objeto con los datos completos de la reserva o undefined si no se encuentra.
 */
export const getByIdCompleto = async (reserva_id) => {
    const sql = `
        SELECT 
            r.fecha_reserva,
            s.titulo AS salon_titulo,
            t.hora_desde,
            t.hora_hasta,
            u.nombre_usuario AS usuario_correo
        FROM reservas r
        JOIN salones s ON r.salon_id = s.salon_id
        JOIN turnos t ON r.turno_id = t.turno_id
        JOIN usuarios u ON r.usuario_id = u.usuario_id
        WHERE r.reserva_id = ? AND r.activo = 1;
    `;
    
    const [results] = await conexion.execute(sql, [reserva_id]);
    
    // Devolvemos solo el primer resultado, que debería ser el único
    return results[0];
};