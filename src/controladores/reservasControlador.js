import ReservasServicio from "../servicios/reservasServicio.js";

export default class ReservasControlador {

  constructor() {
    this.reservasServicio = new ReservasServicio();
  }

  crear = async (req, res) => {
    try {
      const {
        fecha_reserva,
        salon_id,
        usuario_id,
        turno_id,
        foto_cumpleaniero,
        tematica,
        importe_salon,
        importe_total,
        servicios
      } = req.body;

      const reserva = {
        fecha_reserva,
        salon_id,
        usuario_id,
        turno_id,
        foto_cumpleaniero,
        tematica,
        importe_salon,
        importe_total,
        servicios
      };

      const nuevaReserva = await this.reservasServicio.crear(reserva);

      if (!nuevaReserva) {
        return res.status(404).json({
          estado: false,
          mensaje: 'Reserva no creada'
        });
      }

      res.json({
        estado: true,
        mensaje: 'Reserva creada!',
        salon: nuevaReserva
      });

 } catch (err) {
  console.log('Error en POST /reservas/', err);
  res.status(500).json({
    estado: false,
    mensaje: 'Error en POST /reservas/',
    detalle: err?.sqlMessage || err?.message || String(err),
  });
}

  };
}
