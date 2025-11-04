// src/servicios/turnosService.js
import TurnosDB from "../db/turnos.js";

export default class TurnosService {
    constructor() {
        this.turnosDB = new TurnosDB();
    }
    buscarTodos = () => {
        return this.turnosDB.buscarTodos();
    }
    buscarPorId = (turno_id) => {
        return this.turnosDB.buscarPorId(turno_id);
    }
    crear = (turno) => {
        return this.turnosDB.crear(turno);
    }
    modificar = async (turno_id, datos) => {
        const turno = await this.buscarPorId(turno_id);
        if (!turno) return null;
        return this.turnosDB.modificar(turno_id, datos);
    }
    eliminar = async (turno_id) => {
        const turno = await this.buscarPorId(turno_id);
        if (!turno) return 0;
        return this.turnosDB.eliminar(turno_id);
    }
}