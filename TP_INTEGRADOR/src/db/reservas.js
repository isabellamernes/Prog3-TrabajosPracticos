import { conexion } from "./conexion.js";

export default class Reservas {
    buscarPropias = async(usuario_id) => {
        const sql = 'SELECT * FROM reservas WHERE activo = 1 AND usuario_id = ?';
        const [reservas] = await conexion.execute(sql, [usuario_id]);
        return reservas;
    }
    
    buscarTodos = async() => {
        const sql = 'SELECT * FROM reservas WHERE activo = 1';
        const [reservas] = await conexion.execute(sql);
        return reservas;
    }

    buscarPorId = async(reserva_id) => {
        const sql =`
            SELECT 
                r.*, 
                s.titulo AS salon_titulo, 
                t.orden AS turno_orden,
                CONCAT(t.hora_desde, ' a ', t.hora_hasta) AS turno_horario
            FROM 
                reservas r
            JOIN 
                salones s ON r.salon_id = s.salon_id
            JOIN 
                turnos t ON r.turno_id = t.turno_id
            WHERE 
                r.activo = 1 AND r.reserva_id = ?`;
        ;
        const [reserva] = await conexion.execute(sql, [reserva_id]);
        if(reserva.length === 0){
            return null;
        }
        return reserva[0];
    }

    crear = async(reserva) => {
        const {
                fecha_reserva, salon_id, usuario_id, turno_id,
                foto_cumpleaniero, tematica, importe_salon, importe_total 
            } = reserva;
        
        const sql = `INSERT INTO reservas 
            (fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon, importe_total) 
            VALUES (?,?,?,?,?,?,?,?)`;
        
        const [result] = await conexion.execute(sql, 
            [fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon, importe_total]);

        if (result.affectedRows === 0){
            return null;
        }
        return this.buscarPorId(result.insertId);
    }

    modificar = async (reserva_id, datos) => {
        const camposPermitidos = ['fecha_reserva', 'salon_id', 'usuario_id', 'turno_id', 'foto_cumpleaniero', 'tematica', 'importe_total'];
        const camposAActualizar = Object.keys(datos).filter(key => camposPermitidos.includes(key));

        if (camposAActualizar.length === 0) return null;

        const valoresAActualizar = camposAActualizar.map(key => datos[key]);
        const setValores = camposAActualizar.map(campo => `${campo} = ?`).join(', ');
        
        const sql = `UPDATE reservas SET ${setValores} WHERE reserva_id = ?`;
        const [result] = await conexion.execute(sql, [...valoresAActualizar, reserva_id]);

        return result.affectedRows === 0 ? null : this.buscarPorId(reserva_id);
    }

    eliminar = async (reserva_id) => {
        const sql = 'UPDATE reservas SET activo = 0 WHERE reserva_id = ? AND activo = 1';
        const [result] = await conexion.execute(sql, [reserva_id]);
        return result.affectedRows;
    }
    
    datosParaNotificacion = async(reserva_id) => {
        const sql = `CALL obtenerDatosNotificacion(?)`;
        const [reserva] = await conexion.execute(sql, [reserva_id]);
        if(reserva.length === 0){
            return null;
        }
        return reserva;
    }

    buscarDatosReporteCsv = async() => {
        const sql = `CALL reporte_csv()`;
        const [result] = await conexion.query(sql);
        return result[0];
    }
    generarEstadisticaTopSalones = async() => {
        const sql = `CALL sp_estadistica_top_salones()`;
        const [result] = await conexion.query(sql);
        return result[0];
    }
}