// src/servicios/serviciosService.js
import ServiciosDB from "../db/servicios.js";

export default class ServiciosService {
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
        // Aquí podrías agregar lógica de negocio (ej. validar que el importe no sea negativo)
        return this.serviciosDB.crear(servicio);
    }
    modificar = async (servicio_id, datos) => {
        const servicio = await this.buscarPorId(servicio_id);
        if (!servicio) return null;
        return this.serviciosDB.modificar(servicio_id, datos);
    }
    eliminar = async (servicio_id) => {
        const servicio = await this.buscarPorId(servicio_id);
        if (!servicio) return 0; // No se encontró, no se eliminó
        return this.serviciosDB.eliminar(servicio_id);
    }
}