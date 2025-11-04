import ServiciosDB from "../db/servicios.js";

export default class ServiciosServicio {
    constructor() {
        this.serviciosDB = new ServiciosDB();
    }
    buscarTodos = () => {
        return this.serviciosDB.buscarTodos();
    }
    buscarPorId = (servicio_id) => {
        return this.serviciosDB.buscarPorId(servicio_id);
    }
    crear = async (servicio) => {
        return this.serviciosDB.crear(servicio);
    }
    modificar = async (servicio_id, datos) => {
        const servicio = await this.buscarPorId(servicio_id);
        if (!servicio) return null;
        return this.serviciosDB.modificar(servicio_id, datos);
    }
    eliminar = async (servicio_id) => {
        const servicio = await this.buscarPorId(servicio_id);
        if (!servicio) return 0;
        return this.serviciosDB.eliminar(servicio_id);
    }
}