// salon.models.js

import pool from '../db/conexion.js';

/**
 * Obtiene todos los salones que están activos (soft delete = 1).
 * @returns {Promise<Array>} Lista de salones.
 */
const getAllSalones = async () => {
  // Solo trae registros activos
  const [rows] = await pool.query('SELECT * FROM salones WHERE activo = 1');
  return rows;
};

/**
 * Obtiene un salón específico por su ID, siempre y cuando esté activo (soft delete = 1).
 * @param {number} id - El ID del salón.
 * @returns {Promise<Object | undefined>} El objeto salón o undefined si no se encuentra activo.
 */
const getSalonById = async (id) => {
  // Busca por ID y verifica que esté activo
  const [rows] = await pool.query('SELECT * FROM salones WHERE salon_id = ? AND activo = 1', [id]);
  return rows[0];
};

/**
 * Crea un nuevo salón en la base de datos.
 * @param {Object} newSalon - Datos del nuevo salón (titulo, direccion, importe, etc.).
 * @returns {Promise<number>} El ID insertado del nuevo salón.
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
 * Actualiza parcialmente un salón existente.
 * Solo actualiza los campos presentes en el objeto updatedSalon.
 * @param {number} id - El ID del salón a actualizar.
 * @param {Object} updatedSalon - Campos y valores a actualizar.
 * @returns {Promise<boolean>} True si se actualizó al menos una fila, false en caso contrario.
 */
const updateSalon = async (id, updatedSalon) => {
  // Crear una copia del objeto para no modificar el original de la request
  const updates = { ...updatedSalon };
  
  // Excluir campos que no deben ser actualizados por el usuario
  delete updates.salon_id;
  delete updates.creado;
  delete updates.modificado;
  delete updates.activo; // El campo 'activo' se maneja exclusivamente con el soft delete

  const fields = Object.keys(updates);
  const values = Object.values(updates);

  if (fields.length === 0) {
    return false; // No hay campos para actualizar
  }

  // Construir dinámicamente la cláusula SET: field1 = ?, field2 = ?, ...
  const setClause = fields.map(field => `${field} = ?`).join(', ');

  // La consulta debe asegurar que solo se actualicen los salones activos (activo = 1)
  // y que se actualice el campo 'modificado'.
  const query = `
    UPDATE salones 
    SET ${setClause}, modificado = CURRENT_TIMESTAMP() 
    WHERE salon_id = ? AND activo = 1
  `;

  // Concatenar los valores de los campos, más el ID del salón
  const [result] = await pool.query(query, [...values, id]);
  
  return result.affectedRows > 0;
};

/**
 * Realiza la eliminación lógica (soft delete) de un salón.
 * @param {number} id - El ID del salón a eliminar.
 * @returns {Promise<boolean>} True si se modificó (eliminó lógicamente) al menos una fila.
 */
const deleteSalon = async (id) => {
  // Soft Delete: actualiza el campo 'activo' a 0 y la fecha de modificación
  const [result] = await pool.query(
    'UPDATE salones SET activo = 0, modificado = CURRENT_TIMESTAMP() WHERE salon_id = ? AND activo = 1', 
    [id]
  );
  // Se añade AND activo = 1 para asegurar que solo se eliminen los que actualmente están activos
  return result.affectedRows > 0;
};

export default {
  getAllSalones,
  getSalonById,
  createSalon,
  updateSalon,
  deleteSalon,
};