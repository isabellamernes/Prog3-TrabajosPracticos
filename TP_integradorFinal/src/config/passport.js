// src/config/passport.js
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import dotenv from 'dotenv';
import UsuariosDB from '../db/usuarios.js'; // Necesitamos buscar al usuario

dotenv.config(); // Para leer JWT_SECRET

const usuariosDB = new UsuariosDB();
const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
    throw new Error("JWT_SECRET no está definida en .env - ¡La configuración de Passport falló!");
}

// Opciones para configurar la estrategia JWT
const opts = {
    // Indica que el token se extraerá del header 'Authorization' como un 'Bearer' token
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    // La clave secreta que usamos para firmar Y verificar los tokens
    secretOrKey: jwtSecret
    // Podríamos añadir opciones como 'issuer', 'audience' si las usamos al firmar el token
};

// Definimos la estrategia JWT
passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
        // 'jwt_payload' es el objeto que pusimos dentro del token al hacer login (con id, usuario, rol)
        console.log("Payload JWT recibido:", jwt_payload);

        try {
            // Buscamos al usuario en la BD usando el ID del payload del token
            // IMPORTANTE: Asegúrate que tu UsuariosDB tenga un método buscarPorId
            // Si no lo tiene, puedes usar buscarPorNombreUsuario por ahora, o añadir buscarPorId
            // const usuario = await usuariosDB.buscarPorId(jwt_payload.id); // Idealmente
            const usuario = await usuariosDB.buscarPorNombreUsuario(jwt_payload.usuario); // Alternativa si no tienes buscarPorId

            if (usuario) {
                // Si el usuario existe y está activo, lo pasamos al siguiente middleware (adjunto a req.user)
                console.log(`Usuario autenticado via JWT: ${usuario.nombre_usuario} (ID: ${usuario.usuario_id})`);
                return done(null, usuario); // El primer argumento es para errores, el segundo es el usuario
            } else {
                // Si el usuario no se encuentra (o fue desactivado después de emitir el token)
                console.log(`Token JWT válido, pero usuario ID ${jwt_payload.id} no encontrado en DB.`);
                return done(null, false); // Indicamos fallo de autenticación (sin error técnico)
            }
        } catch (error) {
            // Si ocurre un error de base de datos, etc.
            console.error("Error al buscar usuario durante autenticación JWT:", error);
            return done(error, false); // Indicamos error y fallo
        }
    })
);

// Exportamos passport configurado (aunque usualmente solo importamos este archivo para que se ejecute)
export default passport;