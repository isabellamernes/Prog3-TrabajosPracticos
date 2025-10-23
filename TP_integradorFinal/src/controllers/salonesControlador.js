// src/controllers/salonesControlador.js
import SalonesServicio from '../services/salonesServicio.js';

export default class SalonesControlador {

    constructor() {
        this.servicio = new SalonesServicio();
    }

    getAllSalones = async (req, res) => {
        try {
            const salones = await this.servicio.buscarTodos();
            res.json({ ok: true, salones: salones });
        } catch (error) {
            console.log(error);
            res.status(500).json({ estado: false, mensaje: 'Error interno del servidor.' });
        }
    }

    getSalonById = async (req, res) => {
        try {
            const { salon_id } = req.params;
            const salon = await this.servicio.buscarPorId(salon_id);
            if (!salon) {
                return res.status(404).json({ estado: false, mensaje: 'Salón no encontrado.' });
            }
            res.json({ estado: true, salon: salon });
        } catch (error) {
            console.log('Error en GET /salones/:salon_id', error);
            res.status(500).json({ estado: false, mensaje: 'Error interno del servidor.' });
        }
    }

    createSalon = async (req, res) => {
        try {
            // El controlador solo pasa el body al servicio.
            // El servicio se encarga de la validación y de enviar el correo.
            const nuevoSalon = await this.servicio.crear(req.body);
            
            res.status(201).json({ 
                estado: true, 
                mensaje: `Salón creado con id ${nuevoSalon.salon_id}. Se ha enviado una notificación.`,
                salon: nuevoSalon
            });
            
        } catch (error) {
            console.log('Error en POST /salones', error);
            // Si el servicio lanzó un error de validación (ej: campos faltantes)
            if (error.message.includes('Faltan campos')) {
                return res.status(400).json({ estado: false, mensaje: error.message });
            }
            res.status(500).json({ estado: false, mensaje: 'Error interno del servidor.' });
        }
    }

    updateSalon = async (req, res) => {
        try {
            const { salon_id } = req.params;
            // El servicio se encarga de validar si existe
            const salonModificado = await this.servicio.modificar(salon_id, req.body);
            
            if (!salonModificado) {
                 return res.status(404).json({ estado: false, mensaje: 'El salón no existe.' });
            }

            res.status(200).json({ 
                estado: true, 
                mensaje: 'Salón modificado.',
                salon: salonModificado
            });

        } catch (error) {
            console.log('Error en PUT /salones/:salon_id', error);
            if (error.message.includes('Faltan campos')) {
                return res.status(400).json({ estado: false, mensaje: error.message });
            }
            res.status(500).json({ estado: false, mensaje: 'Error interno del servidor.' });
        }
    }

    deleteSalon = async (req, res) => {
        try {
            const { salon_id } = req.params;
            const exito = await this.servicio.eliminar(salon_id);

            if (!exito) {
                return res.status(404).json({ estado: false, mensaje: 'El salón no existe.' });
            }
            res.status(200).json({ estado: true, mensaje: 'Salón eliminado.' });

        } catch (error) {
            console.log('Error en DELETE /salones/:salon_id', error);
            res.status(500).json({ estado: false, mensaje: 'Error interno del servidor.' });
        }
    }
}