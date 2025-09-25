import pool from '../db/conexion.js'; 
const getAllSalones = async () => {
  const [rows] = await pool.query('SELECT * FROM salones WHERE activo = 1');
  return rows;
};

const getSalonById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM salones WHERE salon_id = ? AND activo = 1', [id]);
  return rows[0];
};

const createSalon = async (newSalon) => {
  const { titulo, direccion, latitud, longitud, capacidad, importe } = newSalon;
  const [result] = await pool.query(
    'INSERT INTO salones (titulo, direccion, latitud, longitud, capacidad, importe) VALUES (?, ?, ?, ?, ?, ?)',
    [titulo, direccion, latitud, longitud, capacidad, importe]
  );
  return result.insertId;
};

const updateSalon = async (id, updatedSalon) => {
  const { titulo, direccion, latitud, longitud, capacidad, importe } = updatedSalon;
  const [result] = await pool.query(
    'UPDATE salones SET titulo = ?, direccion = ?, latitud = ?, longitud = ?, capacidad = ?, importe = ?, modificado = CURRENT_TIMESTAMP WHERE salon_id = ?',
    [titulo, direccion, latitud, longitud, capacidad, importe, id]
  );
  return result.affectedRows > 0;
};

const deleteSalon = async (id) => {
  // Soft Delete: en lugar de borrar, se actualiza el campo 'activo' a 0
  const [result] = await pool.query('UPDATE salones SET activo = 0 WHERE salon_id = ?', [id]);
  return result.affectedRows > 0;
};

export default {
  getAllSalones,
  getSalonById,
  createSalon,
  updateSalon,
  deleteSalon,
};