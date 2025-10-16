import Salones from "../db/salones.js";

export default class SalonesServicio {
  constructor() {
    this.salones = new Salones();
  }

  async buscarTodos() {
    return await this.salones.buscarTodos();
  }

  async buscarPorId(salon_id) {
    return await this.salones.buscarPorId(salon_id);
  }

  async crear(salon) {
    return await this.salones.crear(salon);
  }

  async modificar(salon_id, datos) {
    const existe = await this.salones.buscarPorId(salon_id);
    if (!existe) return null;
    return await this.salones.modificar(salon_id, datos);
  }

  async eliminar(salon_id) {
    return await this.salones.eliminar(salon_id);
  }
}
