// src/services/salonesServicio.js
import Salones from "../db/salones.js";
import NotificacionesService from "./notificacionesServicio.js";

export default class SalonesServicio {

    constructor(){
        this.salonesDB = new Salones();
        this.notificacionesServicio = new NotificacionesService();
    }

    buscarTodos = () => {
        return this.salonesDB.buscarTodos();
    }

    buscarPorId = (salon_id) => {
        return this.salonesDB.buscarPorId(salon_id);
    }

    crear = async (salonDatos) => {
        // Extraemos y validamos los nuevos campos
        const { titulo, direccion, latitud, longitud, capacidad, importe } = salonDatos;
        // Añadimos latitud y longitud a la validación básica
        if (!titulo || !direccion || capacidad == null || importe == null || latitud == null || longitud == null ) {
            throw new Error('Faltan campos requeridos (titulo, direccion, latitud, longitud, capacidad, importe).');
        }

        const nuevoSalon = await this.salonesDB.crear(salonDatos); // Pasamos todos los datos

        if (!nuevoSalon) {
            throw new Error('Salón no creado.');
        }

        // --- LÓGICA DE NEGOCIO ---
        // Después de crear el salón, enviamos la notificación.
        try {
            const datosCorreo = {
                fecha: new Date().toLocaleDateString(),
                salon: nuevoSalon.titulo,
                turno: "Turno Tarde (ejemplo)", // Dato de ejemplo
                correoDestino: "eileenmernes@gmail.com" // Correo admin
            };
            // Usamos await para asegurar que el correo se intente enviar
            await this.notificacionesServicio.enviarCorreo(datosCorreo);
        } catch (emailError) {
            // Si el correo falla, lo registramos, pero el salón ya fue creado.
            console.error("Error al enviar correo de notificación:", emailError.message);
        }
        
        return nuevoSalon;
    }

    modificar = async (salon_id, salonDatos) => {
        const salonExistente = await this.buscarPorId(salon_id);
        if (!salonExistente) {
            return null;
        }

        const { titulo, direccion, latitud, longitud, capacidad, importe } = salonDatos;
        // Añadimos latitud y longitud a la validación
        if (!titulo || !direccion || capacidad == null || importe == null || latitud == null || longitud == null ) {
             throw new Error('Faltan campos requeridos (titulo, direccion, latitud, longitud, capacidad, importe).');
        }

        // Pasamos todos los datos al método de DB
        return this.salonesDB.modificar(salon_id, salonDatos);
    }

    eliminar = async (salon_id) => {
        const salonExistente = await this.buscarPorId(salon_id);
        if (!salonExistente) {
            return null; 
        }
        
        const filasAfectadas = await this.salonesDB.eliminar(salon_id);
        return filasAfectadas > 0;
    }
}