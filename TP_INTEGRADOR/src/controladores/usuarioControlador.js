import UsuariosService from "../servicios/usuariosServicio.js";

export default class UsuariosControlador {
    constructor() {
        this.usuariosService = new UsuariosService();
    }

    buscarTodos = async (req, res) => {
        try {
            const usuarios = await this.usuariosService.buscarTodos();
            res.json({ estado: true, datos: usuarios });
        } catch (err) {
            res.status(500).json({ estado: false, mensaje: 'Error interno del servidor.' });
        }
    }

    buscarPorID = async (req, res) => {
        try {
            const usuario_id = req.params.usuario_id;
            const usuario = await this.usuariosService.buscarPorId(usuario_id);
            if (!usuario) {
                return res.status(404).json({ estado: false, mensaje: 'Usuario no encontrado.' });
            }
            res.json({ estado: true, usuario: usuario });
        } catch (err) {
            res.status(500).json({ estado: false, mensaje: 'Error interno del servidor.' });
        }
    }
    
    crear = async (req, res) => {
        try {
            const nuevoUsuario = await this.usuariosService.crear(req.body);
            res.status(201).json({ estado: true, mensaje: 'Usuario creado!', usuario: nuevoUsuario });
        } catch (err) {
            res.status(500).json({ estado: false, mensaje: 'Error interno del servidor.' });
        }
    }

    modificar = async (req, res) => {
        try {
            const usuario_id = req.params.usuario_id;
            const usuarioModificado = await this.usuariosService.modificar(usuario_id, req.body);
            if (!usuarioModificado) {
                return res.status(404).json({ estado: false, mensaje: 'Usuario no encontrado.' });
            }
            res.json({ estado: true, mensaje: 'Usuario modificado!', usuario: usuarioModificado });
        } catch (err) {
            res.status(500).json({ estado: false, mensaje: 'Error interno del servidor.' });
        }
    }

    eliminar = async (req, res) => {
        try {
            const usuario_id = req.params.usuario_id;
            const filasAfectadas = await this.usuariosService.eliminar(usuario_id);
            if (filasAfectadas === 0) {
                return res.status(404).json({ estado: false, mensaje: 'Usuario no encontrado.' });
            }
            res.json({ estado: true, mensaje: 'Usuario eliminado (lógicamente).' });
        } catch (err) {
            res.status(500).json({ estado: false, mensaje: 'Error interno del servidor.' });
        }
    }
}