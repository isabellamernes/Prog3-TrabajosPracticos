// src/db/reservas.js
import { conexion } from "./conexion.js";

export default class Reservas {

  // TRAE TODAS LAS RESERVAS ACTIVAS, CON SUS SERVICIOS
  buscarTodos = async () => {
    const sql = `
      SELECT
        r.reserva_id,
        r.fecha_reserva,
        r.salon_id,
        r.usuario_id,
        r.turno_id,
        r.foto_cumpleaniero,
        r.tematica,
        r.importe_salon,
        r.importe_total,
        r.activo,
        r.creado,
        r.modificado,
        s.titulo          AS salon_titulo,
        t.orden           AS turno_orden,
        t.hora_desde      AS turno_hora_desde,   -- 🔹 agregado
        t.hora_hasta      AS turno_hora_hasta,   -- 🔹 agregado
        se.servicio_id    AS servicio_id,
        se.descripcion    AS servicio_descripcion,
        rs.importe        AS servicio_importe
      FROM reservas AS r
      INNER JOIN salones            AS s  ON s.salon_id      = r.salon_id
      INNER JOIN turnos             AS t  ON t.turno_id      = r.turno_id
      LEFT  JOIN reservas_servicios AS rs ON rs.reserva_id   = r.reserva_id
      LEFT  JOIN servicios          AS se ON se.servicio_id  = rs.servicio_id
      WHERE r.activo = 1
      ORDER BY r.reserva_id;
    `;

    const [filas] = await conexion.execute(sql);

    const reservasMap = new Map();
    const reservas = [];

    for (const fila of filas) {
      let reserva = reservasMap.get(fila.reserva_id);

      if (!reserva) {
        reserva = {
          reserva_id: fila.reserva_id,
          fecha_reserva: fila.fecha_reserva,
          salon_id: fila.salon_id,
          usuario_id: fila.usuario_id,
          turno_id: fila.turno_id,
          foto_cumpleaniero: fila.foto_cumpleaniero,
          tematica: fila.tematica,
          importe_salon: fila.importe_salon,
          importe_total: fila.importe_total,
          activo: fila.activo,
          creado: fila.creado,
          modificado: fila.modificado,
          salon_titulo: fila.salon_titulo,
          turno_orden: fila.turno_orden,
          turno_hora_desde: fila.turno_hora_desde,   // 🔹 agregado
          turno_hora_hasta: fila.turno_hora_hasta,   // 🔹 agregado
          servicios: []
        };

        reservasMap.set(fila.reserva_id, reserva);
        reservas.push(reserva);
      }

      if (fila.servicio_id) {
        reserva.servicios.push({
          servicio_id: fila.servicio_id,
          descripcion: fila.servicio_descripcion,
          importe: fila.servicio_importe
        });
      }
    }

    return reservas;
  };

  // TRAE UNA RESERVA POR ID, CON SUS SERVICIOS
  buscarPorId = async (reserva_id) => {
    const sql = `
      SELECT
        r.reserva_id,
        r.fecha_reserva,
        r.salon_id,
        r.usuario_id,
        r.turno_id,
        r.foto_cumpleaniero,
        r.tematica,
        r.importe_salon,
        r.importe_total,
        r.activo,
        r.creado,
        r.modificado,
        s.titulo          AS salon_titulo,
        t.orden           AS turno_orden,
        t.hora_desde      AS turno_hora_desde,
        t.hora_hasta      AS turno_hora_hasta,
        se.servicio_id    AS servicio_id,
        se.descripcion    AS servicio_descripcion,
        rs.importe        AS servicio_importe
      FROM reservas AS r
      INNER JOIN salones            AS s  ON s.salon_id      = r.salon_id
      INNER JOIN turnos             AS t  ON t.turno_id      = r.turno_id
      LEFT  JOIN reservas_servicios AS rs ON rs.reserva_id   = r.reserva_id
      LEFT  JOIN servicios          AS se ON se.servicio_id  = rs.servicio_id
      WHERE r.activo = 1
        AND r.reserva_id = ?;
    `;

    const [filas] = await conexion.execute(sql, [reserva_id]);

    if (filas.length === 0) {
      return null;
    }

    const primera = filas[0];

    const reserva = {
      reserva_id: primera.reserva_id,
      fecha_reserva: primera.fecha_reserva,
      salon_id: primera.salon_id,
      usuario_id: primera.usuario_id,
      turno_id: primera.turno_id,
      foto_cumpleaniero: primera.foto_cumpleaniero,
      tematica: primera.tematica,
      importe_salon: primera.importe_salon,
      importe_total: primera.importe_total,
      activo: primera.activo,
      creado: primera.creado,
      modificado: primera.modificado,
      salon_titulo: primera.salon_titulo,
      turno_orden: primera.turno_orden,
      turno_hora_desde: primera.turno_hora_desde,  // 🔹 agregado
      turno_hora_hasta: primera.turno_hora_hasta,  // 🔹 agregado
      servicios: []
    };

    for (const fila of filas) {
      if (fila.servicio_id) {
        reserva.servicios.push({
          servicio_id: fila.servicio_id,
          descripcion: fila.servicio_descripcion,
          importe: fila.servicio_importe
        });
      }
    }

    return reserva;
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
        t.orden         AS turno,
        t.hora_desde    AS hora_desde,
        t.hora_hasta    AS hora_hasta
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
