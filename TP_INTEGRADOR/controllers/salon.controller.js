// controllers/salon.controller.js

import salonModel from '../models/salon.models.js';

// BROWSE: Obtener todos los salones
const browse = async (req, res) => {
  try {
    const salones = await salonModel.getAllSalones();
    res.status(200).json(salones);
  } catch (error) {
    console.error("Error en browse de salones:", error); // Log del error
    res.status(500).json({ message: 'Error interno del servidor al obtener los salones.' });
  }
};

// READ: Obtener un salón por ID
const read = async (req, res) => {
  try {
    const { id } = req.params;
    const salon = await salonModel.getSalonById(id);
    if (!salon) {
      return res.status(404).json({ message: 'Salón no encontrado.' });
    }
    res.status(200).json(salon);
  } catch (error) {
    console.error(`Error en read de salón con ID ${req.params.id}:`, error); // Log del error
    res.status(500).json({ message: 'Error interno del servidor al obtener el salón.' });
  }
};

// ADD: Crear un nuevo salón
const add = async (req, res) => {
  try {
    const newSalonId = await salonModel.createSalon(req.body);
    // Se devuelve el ID y un mensaje de éxito con el código 201 (Creado) [cite: 293]
    res.status(201).json({ message: 'Salón creado exitosamente.', salonId: newSalonId });
  } catch (error) {
    console.error("Error en add de salón:", error); // Log del error
    res.status(500).json({ message: 'Error interno del servidor al crear el salón.' });
  }
};

// EDIT: Actualizar un salón
const edit = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await salonModel.updateSalon(id, req.body);
    if (!success) {
      return res.status(404).json({ message: 'Salón no encontrado o sin datos para modificar.' });
    }
    res.status(200).json({ message: 'Salón actualizado exitosamente.' });
  } catch (error) {
    console.error(`Error en edit de salón con ID ${req.params.id}:`, error); // Log del error
    res.status(500).json({ message: 'Error interno del servidor al actualizar el salón.' });
  }
};

// DELETE: Eliminar un salón (Soft Delete)
const del = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await salonModel.deleteSalon(id);
    if (!success) {
      return res.status(404).json({ message: 'Salón no encontrado.' });
    }
    res.status(200).json({ message: 'Salón eliminado exitosamente (marcado como inactivo).' });
  } catch (error) {
    console.error(`Error en delete de salón con ID ${req.params.id}:`, error); // Log del error
    res.status(500).json({ message: 'Error interno del servidor al eliminar el salón.' });
  }
};

export {
  browse,
  read,
  add,
  edit,
  del,
};