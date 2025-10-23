// src/middlewares/authMiddleware.js
import passport from 'passport';

/**
 * Middleware para autenticar usando la estrategia JWT.
 * Si el token es válido, adjunta el usuario a req.user.
 * Si no, devuelve un error 401 Unauthorized.
 */
export const autenticar = (req, res, next) => {
    // Usamos passport.authenticate con la estrategia 'jwt'.
    // { session: false } indica que no usaremos sesiones (somos stateless con JWT).
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        // 'err' sería un error técnico durante la validación (ej: error DB en la estrategia)
        if (err) {
            console.error("Error técnico durante autenticación JWT:", err);
            return res.status(500).json({ estado: false, mensaje: 'Error interno del servidor durante la autenticación.' });
        }
        // 'user' será el objeto usuario si la validación fue exitosa, o 'false' si falló (ej: token inválido, usuario no encontrado)
        if (!user) {
            let mensaje = 'Acceso no autorizado.';
            if (info && info.message) {
                 // 'info' puede contener detalles del fallo (ej: 'No auth token', 'jwt expired')
                console.warn('Fallo de autenticación JWT:', info.message);
                if (info.message === 'jwt expired') {
                    mensaje = 'Acceso no autorizado: El token ha expirado.';
                } else if (info.message === 'No auth token') {
                     mensaje = 'Acceso no autorizado: Token no proporcionado.';
                } else {
                     mensaje = `Acceso no autorizado: ${info.message}.`;
                }
            } else {
                 console.warn('Fallo de autenticación JWT: Usuario no encontrado o token inválido.');
            }
            return res.status(401).json({ estado: false, mensaje: mensaje }); // 401 Unauthorized
        }

        // ¡Autenticación exitosa! Adjuntamos el usuario al request
        req.user = user;
        // Pasamos al siguiente middleware o a la ruta
        next();

    })(req, res, next); // ¡Importante llamar a la función devuelta por passport.authenticate!
};

/**
 * Middleware para autorizar basado en roles.
 * Debe ejecutarse DESPUÉS del middleware 'autenticar'.
 * @param {Array<string>} rolesPermitidos - Array con los nombres de los roles permitidos (ej: ['Administrador', 'Empleado']).
 */
export const autorizar = (rolesPermitidos) => {
    return (req, res, next) => {
        // req.user debería existir si 'autenticar' se ejecutó correctamente
        if (!req.user || !req.user.tipo_usuario) {
            console.warn('Intento de autorización sin usuario autenticado o sin rol definido.');
            return res.status(401).json({ estado: false, mensaje: 'Acceso no autorizado (usuario no identificado).' });
        }

        const rolUsuario = req.user.tipo_usuario;
        console.log(`Verificando autorización para rol: ${rolUsuario}. Roles permitidos: ${rolesPermitidos.join(', ')}`);

        // Verificamos si el rol del usuario está en la lista de roles permitidos
        if (rolesPermitidos.includes(rolUsuario)) {
            // ¡Tiene permiso! Pasamos al siguiente middleware o a la ruta.
            next();
        } else {
            // No tiene permiso.
            console.warn(`Acceso denegado para usuario ${req.user.nombre_usuario} (Rol: ${rolUsuario}) a ruta restringida a roles: ${rolesPermitidos.join(', ')}`);
            return res.status(403).json({ // 403 Forbidden
                estado: false,
                mensaje: 'Acceso denegado: No tienes los permisos necesarios para realizar esta acción.'
            });
        }
    };
};