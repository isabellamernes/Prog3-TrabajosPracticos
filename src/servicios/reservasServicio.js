import Reservas from "../db/reservas.js";
import ReservasServicios from "../db/reservas_servicios.js";
import NotificacionesService from "./notificacionesServicio.js";
export default class ReservasServicio {

  constructor() {
    this.reserva = new Reservas();
    this.reservas_servicios = new ReservasServicios();
    this.notificacionesService = new NotificacionesService();
  }

  buscarTodos = () => {
    return this.reserva.buscarTodos();
  }

  buscarPorId = (reserva_id) => {
    return this.reserva.buscarPorId(reserva_id);
  }

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
      servicios
    } = reserva;

    const nuevaReserva = {
      fecha_reserva,
      salon_id,
      usuario_id,
      turno_id,
      foto_cumpleaniero,
      tematica,
      importe_salon,
      importe_total,
    };

    // SOLO CREO LA RESERVA
    const result = await this.reserva.crear(nuevaReserva);
    //const result = await this.reserva.crearReservaYRelacionesConServicios(nuevaReserva);

    if (!result) {
      return null;
    }
    
    //CREO LA RELACION DE SERVICIOS
    const algo = await this.reservas_servicios.crear(result.reserva_id, servicios);
    
    // BUSCO LOS DATOS PARA LA NOTIFICACION, LEYENDO DESDE LA BASE ES DECIR LOS DATOS CREADOS
    const datosParaNotificacion = await this.reserva.datosParaNotificacion(result.reserva_id);

    // ENVIO NOTIFICACION (no romper si falla)
  try {
    await this.notificacionesService.enviarCorreo(datosParaNotificacion);
  } catch (e) {
    console.warn('No se pudo enviar el correo de confirmación:', e?.message || e);
  }
  // RETORNO LA RESERVA CREADA
  return this.reserva.buscarPorId(result.reserva_id);
  };
  
}