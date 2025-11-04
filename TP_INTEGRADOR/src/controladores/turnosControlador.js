import TurnosServicio from "../servicios/turnosServicio.js";

export default class TurnosControlador {
    constructor() {
        this.turnosService = new TurnosServicio();
    }

    buscarTodos = async (req, res) => {
        try {
            const turnos = await this.turnosService.buscarTodos();
            res.json({ estado: true, datos: turnos });
        } catch (err) {
            res.status(500).json({ estado: false, mensaje: 'Error interno del servidor.' });
        }
    }

    buscarPorID = async (req, res) => {
        try {
            const turno_id = req.params.turno_id;
            const turno = await this.turnosService.buscarPorId(turno_id);
            if (!turno) {
                return res.status(404).json({ estado: false, mensaje: 'Turno no encontrado.' });
            }
            res.json({ estado: true, turno: turno });
        } catch (err) {
            res.status(500).json({ estado: false, mensaje: 'Error interno del servidor.' });
        }
    }
    
    crear = async (req, res) => {
        try {
            const nuevoTurno = await this.turnosService.crear(req.body);
            res.status(201).json({ estado: true, mensaje: 'Turno creado!', turno: nuevoTurno });
        } catch (err) {
            res.status(500).json({ estado: false, mensaje: 'Error interno del servidor.' });
        }
    }

    modificar = async (req, res) => {
        try {
            const turno_id = req.params.turno_id;
            const turnoModificado = await this.turnosService.modificar(turno_id, req.body);
            if (!turnoModificado) {
                return res.status(404).json({ estado: false, mensaje: 'Turno no encontrado.' });
            }
            res.json({ estado: true, mensaje: 'Turno modificado!', turno: turnoModificado });
        } catch (err) {
            res.status(500).json({ estado: false, mensaje: 'Error interno del servidor.' });
        }
    }

    eliminar = async (req, res) => {
        try {
            const turno_id = req.params.turno_id;
            const filasAfectadas = await this.turnosService.eliminar(turno_id);
            if (filasAfectadas === 0) {
                return res.status(404).json({ estado: false, mensaje: 'Turno no encontrado.' });
            }
            res.json({ estado: true, mensaje: 'Turno eliminado (lógicamente).' });
        } catch (err) {
            res.status(500).json({ estado: false, mensaje: 'Error interno del servidor.' });
        }
    }
}