import Usuarios from "../db/usuarios.js";

export default class UsuariosService {
    constructor(){
        this.usuarios = new Usuarios();
    }
    buscar = (nombre_usuario, contrasenia) => {
        return this.usuarios.buscar(nombre_usuario, contrasenia);
    }
    buscarPorId = (usuario_id) => {
        return this.usuarios.buscarPorId(usuario_id);
    }
    buscarTodos = () => {
        return this.usuarios.buscarTodos();
    }
    crear = (usuario) => {
        return this.usuarios.crear(usuario);
    }
    modificar = async (usuario_id, datos) => {
        const usuario = await this.buscarPorId(usuario_id);
        if (!usuario) return null;
        return this.usuarios.modificar(usuario_id, datos);
    }
    eliminar = async (usuario_id) => {
        const usuario = await this.buscarPorId(usuario_id);
        if (!usuario) return 0;
        return this.usuarios.eliminar(usuario_id);
    }
}