// src/db/reservas_servicios.js
import { conexion } from "./conexion.js";

export default class ReservasServicios {

    /**
     * Inserta los servicios asociados a una reserva dentro de una transacción.
     * Recibe la conexión transaccional para asegurar la atomicidad.
     * @param {object} conn - La conexión de base de datos (puede ser transaccional).
     * @param {number} reserva_id - ID de la reserva recién creada.
     * @param {Array} servicios - Array de objetos { servicio_id, importe }.
     */
    crear = async(conn, reserva_id, servicios) => {
        try{
            for (const servicio of servicios){
                const sql = `INSERT INTO reservas_servicios (reserva_id, servicio_id, importe)
                    VALUES (?,?,?);`;
                // Ejecutamos sobre la conexión recibida 'conn'
                await conn.execute(sql, [reserva_id, servicio.servicio_id, servicio.importe ]);
            }
            return true; // Indicamos éxito
        } catch(error) {
            console.error(`Error al insertar servicios para reserva ${reserva_id}: ${error}`);
            // No hacemos rollback aquí, lo maneja el servicio que inició la transacción.
            throw error; // Lanzamos el error para que la transacción falle.
        }
    }
}