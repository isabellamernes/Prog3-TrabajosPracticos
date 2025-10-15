// src/controllers/salon.controller.js

import * as SalonModel from '../models/salon.model.js';
import { enviarCorreo } from '../utils/mailer.js';

// Controlador para obtener todos los salones
export const getAllSalones = async (req, res) => {
    try {
        const salones = await SalonModel.getAll();
        res.json({ ok: true, salones: salones });
    } catch (error) {
        console.log(error);
        res.status(500).json({ estado: false, mensaje: 'Error interno del servidor.' });
    }
};

// Controlador para obtener un salón por ID
export const getSalonById = async (req, res) => {
    try {
        const { salon_id } = req.params;
        const salon = await SalonModel.getById(salon_id);
        if (!salon) {
            return res.status(404).json({ estado: false, mensaje: 'Salón no encontrado.' });
        }
        res.json({ estado: true, salon: salon });
    } catch (error) {
        console.log('Error en GET /salones/:salon_id', error);
        res.status(500).json({ estado: false, mensaje: 'Error interno del servidor.' });
    }
};

// Controlador para crear un salón (MODIFICADO PARA ENVIAR CORREO)
export const createSalon = async (req, res) => {
    try {
        const { titulo, direccion, capacidad, importe } = req.body;
        if (!titulo || !direccion || !capacidad || !importe) {
            return res.status(400).json({ estado: false, mensaje: 'Faltan campos requeridos.' });
        }
        
        const insertId = await SalonModel.create({ titulo, direccion, capacidad, importe });

        // --- INICIO DE LA INTEGRACIÓN DEL CORREO ---
        // Después de crear el salón, preparamos y enviamos una notificación.
        const datosCorreo = {
            fecha: new Date().toLocaleDateString(),
            salon: titulo,
            turno: "Tarde (ejemplo)",
            correoDestino: "eileenmernes@gmail.com" 
        };

        // Llamamos a nuestra función de envío de correo de forma asíncrona.
        // No es necesario usar 'await' aquí si no quieres que la respuesta al cliente
        // espere a que el correo se envíe.
        enviarCorreo(datosCorreo);
        // --- FIN DE LA INTEGRACIÓN DEL CORREO ---

        res.status(201).json({ 
            estado: true, 
            mensaje: `Salón creado con id ${insertId}. Se ha enviado una notificación.` 
        });
        
    } catch (error) {
        console.log('Error en POST /salones', error);
        res.status(500).json({ estado: false, mensaje: 'Error interno del servidor.' });
    }
};


// Controlador para actualizar un salón
export const updateSalon = async (req, res) => {
    try {
        const { salon_id } = req.params;
        const salonExistente = await SalonModel.getById(salon_id);
        if (!salonExistente) {
            return res.status(404).json({ estado: false, mensaje: 'El salón no existe.' });
        }
        const { titulo, direccion, capacidad, importe } = req.body;
        if (!titulo || !direccion || !capacidad || !importe) {
            return res.status(400).json({ estado: false, mensaje: 'Faltan campos requeridos.' });
        }
        await SalonModel.update(salon_id, { titulo, direccion, capacidad, importe });
        res.status(200).json({ estado: true, mensaje: 'Salón modificado.' });
    } catch (error) {
        console.log('Error en PUT /salones/:salon_id', error);
        res.status(500).json({ estado: false, mensaje: 'Error interno del servidor.' });
    }
};

// Controlador para eliminar un salón
export const deleteSalon = async (req, res) => {
    try {
        const { salon_id } = req.params;
        const salonExistente = await SalonModel.getById(salon_id);
        if (!salonExistente) {
            return res.status(404).json({ estado: false, mensaje: 'El salón no existe.' });
        }
        await SalonModel.remove(salon_id);
        res.status(200).json({ estado: true, mensaje: 'Salón eliminado.' });
    } catch (error) {
        console.log('Error en DELETE /salones/:salon_id', error);
        res.status(500).json({ estado: false, mensaje: 'Error interno del servidor.' });
    }
};