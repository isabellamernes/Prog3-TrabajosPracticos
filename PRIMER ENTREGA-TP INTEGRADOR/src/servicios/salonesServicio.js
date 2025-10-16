import Salones from "../db/salones.js";
import { conexion } from "../db/conexion.js";



export default class SalonesServicio {
  constructor() {
    this.Salones = new Salones();
  }

  async buscarTodos() {
    const sql = "SELECT * FROM salones WHERE activo = 1";
    const [rows] = await conexion.execute(sql);
    return rows;
  }

  async buscarPorId(id) {
    const sql = "SELECT * FROM salones WHERE activo = 1 AND salon_id = ?";
    const [rows] = await conexion.execute(sql, [id]);
    return rows[0] || null;
  }

  async crear({ titulo, direccion, capacidad, importe }) {
    const sql =
      "INSERT INTO salones (titulo, direccion, capacidad, importe) VALUES (?, ?, ?, ?)";
    const [result] = await conexion.execute(sql, [
      titulo,
      direccion,
      capacidad,
      importe,
    ]);
    return result.insertId;
  }

  async editar(id, { titulo, direccion, capacidad, importe }) {
    const sql =
      "UPDATE salones SET titulo = ?, direccion = ?, capacidad = ?, importe = ? WHERE salon_id = ?";
    const [result] = await conexion.execute(sql, [
      titulo,
      direccion,
      capacidad,
      importe,
      id,
    ]);
    return result.affectedRows > 0;
  }

  async eliminar(id) {
    const sql = "UPDATE salones SET activo = 0 WHERE salon_id = ?";
    const [result] = await conexion.execute(sql, [id]);
    return result.affectedRows > 0;
  }
}
