// src/db/reservas.js
import { conexion } from './conexion.js';

export default class Reservas {

    buscarTodos = async() => {
        const sql = 'SELECT * FROM reservas WHERE activo = 1';
        const [reservas] = await conexion.execute(sql);
        return reservas;
    }

    buscarPorId = async(reserva_id) => {
        const sql = 'SELECT * FROM reservas WHERE activo = 1 AND reserva_id = ?';
        const [reserva] = await conexion.execute(sql, [reserva_id]);
        if(reserva.length === 0){
            return null;
        }
        return reserva[0];
    }

    crear = async(conn, reserva) => {
        const {
                fecha_reserva,
                salon_id,
                usuario_id,
                turno_id,
                foto_cumpleaniero,
                tematica,
                importe_salon, // <-- Recuerda revisar si este campo es necesario
                importe_total
            } = reserva;

        const sql = `INSERT INTO reservas
            (fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon, importe_total)
            VALUES (?,?,?,?,?,?,?,?)`;

        const [result] = await conn.execute(sql,
            [fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon, importe_total]);

        if (result.affectedRows === 0){
            return null;
        }
        return result.insertId;
    }

    modificar = async (reserva_id, datos) => {
        const camposPermitidos = ['fecha_reserva', 'turno_id', 'foto_cumpleaniero', 'tematica', 'importe_total'];
        const camposAActualizar = Object.keys(datos).filter(key => camposPermitidos.includes(key));

        if (camposAActualizar.length === 0) {
            console.warn(`Intento de modificar reserva ${reserva_id} sin campos válidos.`);
            // Devolvemos null si no hay nada válido que modificar, para consistencia con error
            return null; 
        }

        const valoresAActualizar = camposAActualizar.map(key => datos[key]);
        const setClause = camposAActualizar.map(campo => `${campo} = ?`).join(', ');
        const sql = `UPDATE reservas SET ${setClause} WHERE reserva_id = ? AND activo = 1`; // Aseguramos modificar solo activas
        const parametros = [...valoresAActualizar, reserva_id];

        try {
            const [result] = await conexion.execute(sql, parametros);
            if (result.affectedRows === 0) {
                // Puede ser que no existiera (activo=1) o que los datos fueran iguales
                return null; 
            }
            return this.buscarPorId(reserva_id); // Devuelve la reserva actualizada
        } catch (error) {
            console.error(`Error al modificar reserva ${reserva_id}:`, error);
            throw error;
        }
    }

    /**
     * Realiza una eliminación lógica (soft delete) de una reserva.
     * @param {number} reserva_id - ID de la reserva a desactivar.
     * @returns {Promise<number>} Número de filas afectadas (0 o 1).
     */
    eliminar = async (reserva_id) => {
        const sql = 'UPDATE reservas SET activo = 0 WHERE reserva_id = ? AND activo = 1'; // Solo desactivamos si está activa
        try {
            const [result] = await conexion.execute(sql, [reserva_id]);
            return result.affectedRows; // Devolvemos 1 si se desactivó, 0 si no se encontró o ya estaba inactiva
        } catch (error) {
            console.error(`Error al eliminar (soft delete) reserva ${reserva_id}:`, error);
            throw error;
        }
    }

    datosParaNotificacion = async (reserva_id) => {
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
        if (results.length === 0) return null;
        return results[0];
    }

    /**
     * Obtiene los datos detallados de todas las reservas activas para generar reportes.
     * Incluye información del salón, turno, usuario y los servicios contratados.
     * @returns {Promise<Array>} Un array con los datos detallados de cada reserva.
     */
    buscarDetallesParaReporte = async () => {
        const sql = `
            SELECT
                r.reserva_id,
                r.fecha_reserva,
                r.tematica,
                r.importe_total,
                s.titulo AS salon_titulo,
                t.orden AS turno_orden,
                t.hora_desde AS turno_hora_desde,
                t.hora_hasta AS turno_hora_hasta,
                u.nombre AS usuario_nombre,
                u.apellido AS usuario_apellido,
                u.nombre_usuario AS usuario_correo,
                -- Agrupa los servicios de cada reserva en un solo string (o NULL si no hay)
                GROUP_CONCAT(
                    DISTINCT CONCAT(serv.descripcion, ' ($', rs.importe, ')') -- Formato: "Nombre Servicio ($Importe)"
                    ORDER BY serv.descripcion
                    SEPARATOR '; ' -- Separador entre servicios
                ) AS servicios_contratados
            FROM reservas r
            JOIN salones s ON r.salon_id = s.salon_id
            JOIN turnos t ON r.turno_id = t.turno_id
            JOIN usuarios u ON r.usuario_id = u.usuario_id
            -- LEFT JOIN para incluir reservas sin servicios
            LEFT JOIN reservas_servicios rs ON r.reserva_id = rs.reserva_id
            LEFT JOIN servicios serv ON rs.servicio_id = serv.servicio_id
            WHERE r.activo = 1 -- Solo reservas activas
            GROUP BY r.reserva_id -- Agrupamos por reserva para que GROUP_CONCAT funcione
            ORDER BY r.fecha_reserva, s.titulo, t.orden; -- Ordenamos el reporte
        `;
        try {
            const [results] = await conexion.execute(sql);
            return results;
        } catch (error) {
            console.error("Error al buscar detalles para reporte:", error);
            throw error;
        }
    }
}


    
    