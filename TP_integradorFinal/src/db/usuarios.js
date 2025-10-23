// src/db/usuarios.js
import { conexion } from './conexion.js';

export default class UsuariosDB {

    /**
     * Busca un usuario activo por su nombre de usuario.
     * @param {string} nombreUsuario
     * @returns {Promise<object|null>} 
     */
    buscarPorNombreUsuario = async (nombreUsuario) => {
        const sql = 'SELECT usuario_id, nombre, apellido, nombre_usuario, contrasenia, tipo_usuario FROM usuarios WHERE nombre_usuario = ? AND activo = 1';
        try {
            const [results] = await conexion.execute(sql, [nombreUsuario]);
            if (results.length === 0) {
                return null;
            }
            return results[0]; 
        } catch (error) {
            console.error(`Error al buscar usuario por nombre_usuario ${nombreUsuario}:`, error);
            throw error;
        }
    }

}