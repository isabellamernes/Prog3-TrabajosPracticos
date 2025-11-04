// src/db/turnos.js
import { conexion } from "./conexion.js";

export default class TurnosDB {
    buscarTodos = async () => {
        const sql = 'SELECT * FROM turnos WHERE activo = 1 ORDER BY orden';
        const [turnos] = await conexion.execute(sql);
        return turnos;
    }

    buscarPorId = async (turno_id) => {
        const sql = 'SELECT * FROM turnos WHERE activo = 1 AND turno_id = ?';
        const [turno] = await conexion.execute(sql, [turno_id]);
        return turno.length === 0 ? null : turno[0];
    }

    crear = async (turno) => {
        const { orden, hora_desde, hora_hasta } = turno;
        const sql = 'INSERT INTO turnos (orden, hora_desde, hora_hasta) VALUES (?, ?, ?)';
        const [result] = await conexion.execute(sql, [orden, hora_desde, hora_hasta]);
        return result.affectedRows === 0 ? null : this.buscarPorId(result.insertId);
    }

    modificar = async (turno_id, datos) => {
        const camposAActualizar = Object.keys(datos).map(key => `${key} = ?`).join(', ');
        const valoresAActualizar = [...Object.values(datos), turno_id];
        const sql = `UPDATE turnos SET ${camposAActualizar} WHERE turno_id = ?`;
        
        const [result] = await conexion.execute(sql, valoresAActualizar);
        return result.affectedRows === 0 ? null : this.buscarPorId(turno_id);
    }

    eliminar = async (turno_id) => {
        const sql = 'UPDATE turnos SET activo = 0 WHERE turno_id = ? AND activo = 1';
        const [result] = await conexion.execute(sql, [turno_id]);
        return result.affectedRows;
    }
}