// src/db/salones.js
import { conexion } from './conexion.js';

export default class Salones {

    buscarTodos = async () => {
        const [results] = await conexion.query('SELECT * FROM salones WHERE activo = 1');
        return results;
    }

    buscarPorId = async (salon_id) => {
        const [results] = await conexion.execute('SELECT * FROM salones WHERE activo = 1 AND salon_id = ?', [salon_id]);
        
        if (results.length === 0) {
            return null;
        }
        return results[0];
    }

    crear = async ({ titulo, direccion, latitud, longitud, capacidad, importe }) => {
        const sql = 'INSERT INTO salones (titulo, direccion, latitud, longitud, capacidad, importe) VALUES (?,?,?,?,?,?)';
        const [result] = await conexion.execute(sql, [titulo, direccion, latitud, longitud, capacidad, importe]);

        if (result.affectedRows === 0) {
            return null;
        }
        // Devolvemos el salón recién creado
        return this.buscarPorId(result.insertId);
    }

    modificar = async (salon_id, { titulo, direccion, latitud, longitud, capacidad, importe }) => {
        const sql = 'UPDATE salones SET titulo = ?, direccion = ?, latitud = ?, longitud = ?, capacidad = ?, importe = ? WHERE salon_id = ?';
        const [result] = await conexion.execute(sql, [titulo, direccion, latitud, longitud, capacidad, importe, salon_id]);
        
        if (result.affectedRows === 0) {
            return null;
        }
        // Devolvemos el salón modificado
        return this.buscarPorId(salon_id);
    }

    eliminar = async (salon_id) => {
        const sql = 'UPDATE salones SET activo = 0 WHERE salon_id = ?';
        const [result] = await conexion.execute(sql, [salon_id]);
        return result.affectedRows;
    }
}