// models/salon.models.js

import pool from '../db/conexion.js';

/**
 * Obtiene todos los salones activos.
 */
const getAllSalones = async () => {
  const [rows] = await pool.query('SELECT * FROM salones WHERE activo = 1');
  return rows;
};

/**
 * Obtiene un salón activo por su ID.
 */
const getSalonById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM salones WHERE salon_id = ? AND activo = 1', [id]);
  return rows[0];
};

/**
 * Crea un nuevo salón.
 */
const createSalon = async (newSalon) => {
  const { titulo, direccion, latitud, longitud, capacidad, importe } = newSalon;
  const [result] = await pool.query(
    'INSERT INTO salones (titulo, direccion, latitud, longitud, capacidad, importe) VALUES (?, ?, ?, ?, ?, ?)',
    [titulo, direccion, latitud, longitud, capacidad, importe]
  );
  return result.insertId;
};

/**
 * Actualiza un salón existente.
 */
const updateSalon = async (id, updatedSalon) => {
  const updates = { ...updatedSalon };
  
  // Excluye campos que no deben ser actualizados directamente por el usuario
  delete updates.salon_id;
  delete updates.creado;
  delete updates.modificado;
  delete updates.activo;

  const fields = Object.keys(updates);
  if (fields.length === 0) {
    return false; // No hay nada que actualizar
  }

  const setClause = fields.map(field => `${field} = ?`).join(', ');

  const query = `
    UPDATE salones 
    SET ${setClause}, modificado = CURRENT_TIMESTAMP() 
    WHERE salon_id = ? AND activo = 1
  `;

  const [result] = await pool.query(query, [...Object.values(updates), id]);
  return result.affectedRows > 0;
};

/**
 * Realiza un borrado lógico (soft delete) de un salón.
 */
const deleteSalon = async (id) => {
  const [result] = await pool.query(
    'UPDATE salones SET activo = 0, modificado = CURRENT_TIMESTAMP() WHERE salon_id = ? AND activo = 1', 
    [id]
  );
  return result.affectedRows > 0;
};

export default {
  getAllSalones,
  getSalonById,
  createSalon,
  updateSalon,
  deleteSalon,
};