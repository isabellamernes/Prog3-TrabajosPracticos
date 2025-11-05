import { conexion } from "./conexion.js";

export default class ReservasServicios {
    crear = async(reserva_id, servicios) => {
        try{
            await conexion.beginTransaction();
            for (const servicio of servicios){
                const sql = `INSERT INTO reservas_servicios (reserva_id, servicio_id, importe) 
                    VALUES (?,?,?);`;
                await conexion.execute(sql, [reserva_id, servicio.servicio_id, servicio.importe ]);
            }
            await conexion.commit();
            return true;
        }catch(error){
            await conexion.rollback();
            console.log(`error ${error}`);
            return false;
        }
    }

    buscarPorReservaId = async(reserva_id) => {
        const sql = `
            SELECT 
                s.servicio_id, 
                s.descripcion, 
                rs.importe 
            FROM 
                reservas_servicios rs
            JOIN 
                servicios s ON rs.servicio_id = s.servicio_id
            WHERE 
                rs.reserva_id = ? AND s.activo = 1`;
        const [servicios] = await conexion.execute(sql, [reserva_id]);
        return servicios;
    }
}