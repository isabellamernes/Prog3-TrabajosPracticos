// models/salon.models.js

import pool from '../db/conexion.js';

/**
 * Obtiene todos los salones activos.
 */
const obtenerTodos = async () => {
  const [filas] = await pool.query('SELECT * FROM salones WHERE activo = 1');
  return filas;
};

/**
 * Obtiene un salón activo por su ID.
 */
const obtenerPorId = async (id) => {
  const [filas] = await pool.query('SELECT * FROM salones WHERE salon_id = ? AND activo = 1', [id]);
  return filas[0];
};

/**
 * Crea un nuevo salón.
 */
const crear = async (nuevoSalon) => {
  const { titulo, direccion, latitud, longitud, capacidad, importe } = nuevoSalon;
  const [resultado] = await pool.query(
    'INSERT INTO salones (titulo, direccion, latitud, longitud, capacidad, importe) VALUES (?, ?, ?, ?, ?, ?)',
    [titulo, direccion, latitud, longitud, capacidad, importe]
  );
  return resultado.insertId;
};

/**
 * Actualiza un salón existente.
 */
const actualizar = async (id, datosSalon) => {
  const campos = { ...datosSalon };
  
  delete campos.salon_id;
  delete campos.creado;
  delete campos.modificado;
  delete campos.activo;

  const claves = Object.keys(campos);
  if (claves.length === 0) {
    return false;
  }

  const clausulaSet = claves.map(clave => `${clave} = ?`).join(', ');

  const consulta = `
    UPDATE salones 
    SET ${clausulaSet}, modificado = CURRENT_TIMESTAMP() 
    WHERE salon_id = ? AND activo = 1
  `;

  const [resultado] = await pool.query(consulta, [...Object.values(campos), id]);
  return resultado.affectedRows > 0;
};

/**
 * Realiza un borrado lógico de un salón.
 */
const eliminar = async (id) => {
  const [resultado] = await pool.query(
    'UPDATE salones SET activo = 0, modificado = CURRENT_TIMESTAMP() WHERE salon_id = ? AND activo = 1', 
    [id]
  );
  return resultado.affectedRows > 0;
};

export default {
  obtenerTodos,
  obtenerPorId,
  crear,
  actualizar,
  eliminar,
};