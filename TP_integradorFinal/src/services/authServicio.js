// src/services/authServicio.js
import UsuariosDB from '../db/usuarios.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); 

export default class AuthServicio {

    constructor() {
        this.usuariosDB = new UsuariosDB();
        // Leemos la clave secreta para JWT desde .env
        // ¡Asegúrate de añadir JWT_SECRET a tu archivo .env!
        this.jwtSecret = process.env.JWT_SECRET;
        if (!this.jwtSecret) {
            console.error("¡ERROR FATAL: JWT_SECRET no está definida en el archivo .env!");
            // En una aplicación real, probablemente querrías detener el inicio aquí.
        }
    }

    /**
     * Intenta autenticar a un usuario y genera un token JWT si tiene éxito.
     * @param {string} nombreUsuario - El nombre de usuario ingresado.
     * @param {string} contrasenia - La contraseña ingresada (en texto plano).
     * @returns {Promise<string|null>} El token JWT si la autenticación es exitosa, o null si falla.
     */
    login = async (nombreUsuario, contrasenia) => {
        try {
            // 1. Buscar al usuario en la BD
            const usuario = await this.usuariosDB.buscarPorNombreUsuario(nombreUsuario);

            // 2. Si no existe o la contraseña no coincide, retornar null
            if (!usuario) {
                console.log(`Intento de login fallido: Usuario '${nombreUsuario}' no encontrado o inactivo.`);
                return null;
            }

            // 3. Comparar la contraseña ingresada con el hash guardado
            const contraseniaValida = bcrypt.compareSync(contrasenia, usuario.contrasenia);
            if (!contraseniaValida) {
                console.log(`Intento de login fallido: Contraseña incorrecta para usuario '${nombreUsuario}'.`);
                return null;
            }

            // 4. ¡Autenticación exitosa! Generar el token JWT
            console.log(`Login exitoso para usuario '${nombreUsuario}'. Generando token...`);

            // El 'payload' es la información que guardaremos DENTRO del token.
            // Es visible (no sensible), pero la firma asegura que no ha sido modificada.
            const payload = {
                id: usuario.usuario_id,
                usuario: usuario.nombre_usuario,
                rol: usuario.tipo_usuario // ¡Importante para la autorización!
            };

            // Firmamos el token con nuestra clave secreta y definimos una expiración (ej: 1 hora)
            const token = jwt.sign(payload, this.jwtSecret, { expiresIn: '1h' });

            return token;

        } catch (error) {
            console.error("Error durante el proceso de login:", error);
            throw new Error('Error interno durante la autenticación.');
        }
    }
}