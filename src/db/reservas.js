// src/db/reservas.js
import { conexion } from "./conexion.js";

export default class Reservas {

  buscarTodos = async () => {
    const sql = `SELECT * FROM reservas WHERE activo = 1`;
    const [rows] = await conexion.execute(sql);
    return rows; // siempre un array
  };

  buscarPorId = async (reserva_id) => {
    const sql = `SELECT * FROM reservas WHERE reserva_id = ?`;
    const [rows] = await conexion.execute(sql, [reserva_id]);
    return rows[0] || null;
  };

  crear = async (reserva) => {
    const {
      fecha_reserva,
      salon_id,
      usuario_id,
      turno_id,
      foto_cumpleaniero,
      tematica,
      importe_salon,
      importe_total,
      servicios = []
    } = reserva;

    // 1) Inserto la reserva
    const insertReserva = `
      INSERT INTO reservas
        (fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon, importe_total)
      VALUES (?,?,?,?,?,?,?,?)
    `;
    const [result] = await conexion.execute(insertReserva, [
      fecha_reserva, salon_id, usuario_id, turno_id,
      foto_cumpleaniero, tematica, importe_salon, importe_total
    ]);

    if (result.affectedRows === 0) return null;

    const reservaId = result.insertId;

    // 2) Inserto relaciones (si hay)
    const insertRel = `
      INSERT INTO reservas_servicios (reserva_id, servicio_id, importe)
      VALUES (?,?,?)
    `;
    for (const s of servicios) {
      await conexion.execute(insertRel, [reservaId, s.servicio_id, s.importe]);
    }

    return this.buscarPorId(reservaId);
  };

  datosParaNotificacion = async (reserva_id) => {
  const sql = `
    SELECT
      r.fecha_reserva AS fecha,
      s.titulo        AS salon,
      t.orden         AS turno
    FROM reservas AS r
    INNER JOIN salones AS s ON s.salon_id = r.salon_id
    INNER JOIN turnos  AS t ON t.turno_id  = r.turno_id
    WHERE r.activo = 1 AND r.reserva_id = ?;
  `;

  const [reserva] = await conexion.execute(sql, [reserva_id]);
  if (reserva.length === 0) {
    return null;
  }
  return reserva[0];
};

}
