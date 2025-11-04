import { conexion } from "./conexion.js";

export default class ServiciosDB {
    buscarTodos = async () => {
        const sql = 'SELECT * FROM servicios WHERE activo = 1';
        const [servicios] = await conexion.execute(sql);
        return servicios;
    }

    buscarPorId = async (servicio_id) => {
        const sql = 'SELECT * FROM servicios WHERE activo = 1 AND servicio_id = ?';
        const [servicio] = await conexion.execute(sql, [servicio_id]);
        return servicio.length === 0 ? null : servicio[0];
    }

    crear = async (servicio) => {
        const { descripcion, importe } = servicio;
        const sql = 'INSERT INTO servicios (descripcion, importe) VALUES (?, ?)';
        const [result] = await conexion.execute(sql, [descripcion, importe]);
        return result.affectedRows === 0 ? null : this.buscarPorId(result.insertId);
    }

    modificar = async (servicio_id, datos) => {
        const camposAActualizar = Object.keys(datos).map(key => `${key} = ?`).join(', ');
        const valoresAActualizar = [...Object.values(datos), servicio_id];
        const sql = `UPDATE servicios SET ${camposAActualizar} WHERE servicio_id = ?`;
        
        const [result] = await conexion.execute(sql, valoresAActualizar);
        return result.affectedRows === 0 ? null : this.buscarPorId(servicio_id);
    }

    eliminar = async (servicio_id) => {
        const sql = 'UPDATE servicios SET activo = 0 WHERE servicio_id = ? AND activo = 1';
        const [result] = await conexion.execute(sql, [servicio_id]);
        return result.affectedRows; 
    }
}