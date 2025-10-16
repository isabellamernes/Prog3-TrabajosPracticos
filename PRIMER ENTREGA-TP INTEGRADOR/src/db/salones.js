import { conexion } from "./conexion.js";

class Salones {
    buscarTodos = async () => {
        try {
            const sql = 'SELECT * FROM salones WHERE activo = 1';
            const [salones] = await conexion.query(sql);
            return salones;
        } catch (error) {
            console.error("Error al buscar salones:", error);
            throw error;
        }
    }
}

export default Salones;
