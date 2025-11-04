// src/db/usuarios.js
import { conexion } from "./conexion.js";

export default class Usuarios {
    buscar = async (nombre_usuario, contrasenia) => {
        const sql = `SELECT u.usuario_id, CONCAT(u.nombre, ' ', u.apellido) as usuario, u.tipo_usuario
                        FROM usuarios  AS u
                        WHERE u.nombre_usuario = ? 
                            AND u.contrasenia = SHA2(?, 256) 
                            AND u.activo = 1;`
        const [result] = await conexion.query(sql, [nombre_usuario, contrasenia]);
        return result[0];
    }

    buscarPorId = async (usuario_id) => {
        const sql = `SELECT usuario_id, nombre, apellido, nombre_usuario, tipo_usuario, celular, foto
                        FROM usuarios  AS u
                        WHERE u.usuario_id = ? AND u.activo = 1;`
        const [result] = await conexion.query(sql, [usuario_id]);
        return result.length === 0 ? null : result[0];
    }

    buscarTodos = async () => {
        const sql = 'SELECT usuario_id, nombre, apellido, nombre_usuario, tipo_usuario, celular FROM usuarios WHERE activo = 1';
        const [usuarios] = await conexion.execute(sql);
        return usuarios;
    }

    crear = async (usuario) => {
        const { nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, celular, foto } = usuario;
        const sql = `INSERT INTO usuarios (nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, celular, foto) 
                     VALUES (?, ?, ?, SHA2(?, 256), ?, ?, ?)`;
        const [result] = await conexion.execute(sql, [nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, celular, foto]);
        return result.affectedRows === 0 ? null : this.buscarPorId(result.insertId);
    }

    modificar = async (usuario_id, datos) => {
        const camposPermitidos = ['nombre', 'apellido', 'nombre_usuario', 'tipo_usuario', 'celular', 'foto'];
        const camposAActualizar = Object.keys(datos).filter(key => camposPermitidos.includes(key));
        
        if (camposAActualizar.length === 0) return null; // Nada que actualizar

        const valoresAActualizar = camposAActualizar.map(key => datos[key]);
        const setValores = camposAActualizar.map(campo => `${campo} = ?`).join(', ');
        
        const sql = `UPDATE usuarios SET ${setValores} WHERE usuario_id = ?`;
        const [result] = await conexion.execute(sql, [...valoresAActualizar, usuario_id]);

        return result.affectedRows === 0 ? null : this.buscarPorId(usuario_id);
    }

    eliminar = async (usuario_id) => {
        const sql = 'UPDATE usuarios SET activo = 0 WHERE usuario_id = ? AND activo = 1';
        const [result] = await conexion.execute(sql, [usuario_id]);
        return result.affectedRows;
    }
}