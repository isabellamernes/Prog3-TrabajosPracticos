import salonModel from '../models/salon.models.js';

const browse = async (req, res) => {
  try {
    const salones = await salonModel.getAllSalones();
    res.status(200).json(salones);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los salones', error: error.message });
  }
};

const read = async (req, res) => {
  try {
    const { id } = req.params;
    const salon = await salonModel.getSalonById(id);
    if (!salon) {
      return res.status(404).json({ message: 'Salón no encontrado' });
    }
    res.status(200).json(salon);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el salón', error: error.message });
  }
};

const add = async (req, res) => {
  try {
    const newSalonId = await salonModel.createSalon(req.body);
    res.status(201).json({ message: 'Salón creado exitosamente', salonId: newSalonId });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el salón', error: error.message });
  }
};

const edit = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await salonModel.updateSalon(id, req.body);
    if (!success) {
      return res.status(404).json({ message: 'Salón no encontrado o sin cambios' });
    }
    res.status(200).json({ message: 'Salón actualizado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el salón', error: error.message });
  }
};

const del = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await salonModel.deleteSalon(id);
    if (!success) {
      return res.status(404).json({ message: 'Salón no encontrado' });
    }
    res.status(200).json({ message: 'Salón eliminado lógicamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el salón', error: error.message });
  }
};

export {
  browse,
  read,
  add,
  edit,
  del,
};