// controllers/salon.controller.js

import salonModelo from '../models/salon.models.js';

// LISTAR todos los salones
const listarTodos = async (req, res) => {
  try {
    const salones = await salonModelo.obtenerTodos();
    res.status(200).json(salones);
  } catch (error) {
    console.error("Error en listarTodos de salones:", error);
    res.status(500).json({ message: 'Error interno del servidor al obtener los salones.' });
  }
};

// OBTENER un salón por su ID
const obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const salon = await salonModelo.obtenerPorId(id);
    if (!salon) {
      return res.status(404).json({ message: 'Salón no encontrado.' });
    }
    res.status(200).json(salon);
  } catch (error) {
    console.error(`Error en obtenerPorId de salón con ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error interno del servidor al obtener el salón.' });
  }
};

// CREAR un nuevo salón
const crear = async (req, res) => {
  try {
    const nuevoSalonId = await salonModelo.crear(req.body);
    res.status(201).json({ message: 'Salón creado exitosamente.', salonId: nuevoSalonId });
  } catch (error) {
    console.error("Error en crear de salón:", error);
    res.status(500).json({ message: 'Error interno del servidor al crear el salón.' });
  }
};

// EDITAR un salón existente
const editar = async (req, res) => {
  try {
    const { id } = req.params;
    const salonActualizado = await salonModelo.actualizar(id, req.body);
    if (!salonActualizado) {
      return res.status(404).json({ message: 'Salón no encontrado o sin datos para modificar.' });
    }
    res.status(200).json({ message: 'Salón actualizado exitosamente.' });
  } catch (error) {
    console.error(`Error en editar de salón con ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error interno del servidor al actualizar el salón.' });
  }
};

// ELIMINAR un salón (Borrado Lógico)
const eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    const exito = await salonModelo.eliminar(id);
    if (!exito) {
      return res.status(404).json({ message: 'Salón no encontrado.' });
    }
    res.status(200).json({ message: 'Salón eliminado exitosamente.' });
  } catch (error) {
    console.error(`Error en eliminar de salón con ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error interno del servidor al eliminar el salón.' });
  }
};

export {
  listarTodos,
  obtenerPorId,
  crear,
  editar,
  eliminar,
};