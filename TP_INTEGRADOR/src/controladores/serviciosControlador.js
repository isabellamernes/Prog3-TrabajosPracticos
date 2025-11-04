import ServiciosServicio from "../servicios/serviciosServicio.js";

export default class ServiciosControlador {
    constructor() {
        this.serviciosService = new ServiciosServicio();
    }

    buscarTodos = async (req, res) => {
        try {
            const servicios = await this.serviciosService.buscarTodos();
            res.json({ estado: true, datos: servicios });
        } catch (err) {
            res.status(500).json({ estado: false, mensaje: 'Error interno del servidor.' });
        }
    }

    buscarPorID = async (req, res) => {
        try {
            const servicio_id = req.params.servicio_id;
            const servicio = await this.serviciosService.buscarPorId(servicio_id);
            if (!servicio) {
                return res.status(404).json({ estado: false, mensaje: 'Servicio no encontrado.' });
            }
            res.json({ estado: true, servicio: servicio });
        } catch (err) {
            res.status(500).json({ estado: false, mensaje: 'Error interno del servidor.' });
        }
    }
    
    crear = async (req, res) => {
        try {
            const nuevoServicio = await this.serviciosService.crear(req.body);
            res.status(201).json({ estado: true, mensaje: 'Servicio creado!', servicio: nuevoServicio });
        } catch (err) {
            res.status(500).json({ estado: false, mensaje: 'Error interno del servidor.' });
        }
    }

    modificar = async (req, res) => {
        try {
            const servicio_id = req.params.servicio_id;
            const servicioModificado = await this.serviciosService.modificar(servicio_id, req.body);
            if (!servicioModificado) {
                return res.status(404).json({ estado: false, mensaje: 'Servicio no encontrado.' });
            }
            res.json({ estado: true, mensaje: 'Servicio modificado!', servicio: servicioModificado });
        } catch (err) {
            res.status(500).json({ estado: false, mensaje: 'Error interno del servidor.' });
        }
    }

    eliminar = async (req, res) => {
        try {
            const servicio_id = req.params.servicio_id;
            const filasAfectadas = await this.serviciosService.eliminar(servicio_id);
            if (filasAfectadas === 0) {
                return res.status(404).json({ estado: false, mensaje: 'Servicio no encontrado.' });
            }
            res.json({ estado: true, mensaje: 'Servicio eliminado (lógicamente).' });
        } catch (err) {
            res.status(500).json({ estado: false, mensaje: 'Error interno del servidor.' });
        }
    }
}