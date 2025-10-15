// src/models/salon.model.js
import { conexion } from '../../db/conexion.js';

export const getAll = async () => {
    const [results] = await conexion.query('SELECT * FROM salones WHERE activo = 1');
    return results;
};

export const getById = async (salon_id) => {
    const [results] = await conexion.execute('SELECT * FROM salones WHERE activo = 1 AND salon_id = ?', [salon_id]);
    return results[0];
};

export const create = async ({ titulo, direccion, capacidad, importe }) => {
    const sql = 'INSERT INTO salones (titulo, direccion, capacidad, importe) VALUES (?,?,?,?)';
    const [result] = await conexion.execute(sql, [titulo, direccion, capacidad, importe]);
    return result.insertId;
};

export const update = async (salon_id, { titulo, direccion, capacidad, importe }) => {
    const sql = 'UPDATE salones SET titulo = ?, direccion = ?, capacidad = ?, importe = ? WHERE salon_id = ?';
    const [result] = await conexion.execute(sql, [titulo, direccion, capacidad, importe, salon_id]);
    return result.affectedRows;
};

export const remove = async (salon_id) => {
    const sql = 'UPDATE salones SET activo = 0 WHERE salon_id = ?';
    const [result] = await conexion.execute(sql, [salon_id]);
    return result.affectedRows;
};