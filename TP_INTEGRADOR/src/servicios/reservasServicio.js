import Reservas from "../db/reservas.js";
import ReservasServicios from "../db/reservas_servicios.js";
import NotificacionesServicio from "./notificacionesServicio.js";
import InformeServicio from "./informesServicio.js"; 

export default class ReservasServicio {
    constructor(){
        this.reserva = new Reservas();
        this.reservas_servicios = new ReservasServicios();
        this.notificacionesServicio = new NotificacionesServicio();
        this.informes = new InformeServicio(); 
    }
    
    buscarTodos = (usuario) => {
        if(usuario.tipo_usuario < 3){ 
            return this.reserva.buscarTodos();
        }else{
            return this.reserva.buscarPropias(usuario.usuario_id);
        }
    }

    buscarPorId = (reserva_id) => {
        return this.reserva.buscarPorId(reserva_id);
    }

    crear = async (reserva) => {
        const {
            fecha_reserva, salon_id, usuario_id, turno_id,
            foto_cumpleaniero, tematica, importe_salon, importe_total,
            servicios 
        } = reserva;

        const nuevaReserva = {
            fecha_reserva, salon_id, usuario_id, turno_id,
            foto_cumpleaniero, tematica, importe_salon, importe_total
        }    

        const result = await this.reserva.crear(nuevaReserva);
        if (!result) return null;

        await this.reservas_servicios.crear(result.reserva_id, servicios);     
        
        try {
            const datosParaNotificacion = await this.reserva.datosParaNotificacion(result.reserva_id);
            await this.notificacionesServicio.enviarCorreo(datosParaNotificacion);
        } catch (notificationError) {            
            console.log('Advertencia: No se pudo enviar el correo.', notificationError);
        }

        // 1. Busca la reserva principal (ahora con salon_titulo y turno_orden)
        const reservaCompleta = await this.reserva.buscarPorId(result.reserva_id);
        if (!reservaCompleta) return null;

        // 2. Busca los servicios asociados usando la nueva función
       const serviciosCompletos = await this.reservas_servicios.buscarPorReservaId(result.reserva_id);

        // 3. Combina todo y devuelve
        reservaCompleta.servicios = serviciosCompletos;
        return reservaCompleta;
    }

    modificar = async (reserva_id, datos) => {
        const reserva = await this.buscarPorId(reserva_id);
        if (!reserva) return null;
        return this.reserva.modificar(reserva_id, datos);
    }

    eliminar = async (reserva_id) => {
        const reserva = await this.buscarPorId(reserva_id);
        if (!reserva) return 0;
        return this.reserva.eliminar(reserva_id);
    }

    generarInforme = async (formato) => {
        const datosReporte = await this.reserva.buscarDatosReporteCsv();

        if (formato === 'pdf') {
            const pdf = await this.informes.informeReservasPdf(datosReporte);
            return {
                buffer: pdf,
                headers:{
                    'Content-Type' : 'application/pdf',
                    'Content-Disposition' : 'inline; filename="reservas.pdf"'
                }
            }
        } else if (formato === 'csv'){
            const csv =  await this.informes.informeReservasCsv(datosReporte);
            return {
                path: csv,
                headers:{
                    'Content-Type' : 'text/csv',
                    'Content-Disposition' : 'attachment; filename="reservas.csv"'
                }
            }
        }
    }
}