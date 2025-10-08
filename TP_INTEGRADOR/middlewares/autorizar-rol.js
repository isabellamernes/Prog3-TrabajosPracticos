// En un archivo: middlewares/autorizar-rol.js

/**
 * Middleware para restringir el acceso basado en los roles del usuario.
 * @param {number[]} rolesPermitidos - Array de IDs de roles permitidos (e.g., [1, 2]).
 */
export const autorizarRol = (rolesPermitidos) => {
    return (req, res, next) => {
        // Se asume que 'req.usuario' fue poblado por el middleware verificarJWT
        if (!req.usuario || !req.usuario.tipo_usuario) {
            // Esto no debería pasar si verificarJWT se ejecuta primero, pero es una seguridad
            return res.status(500).json({
                msg: 'Error interno de autenticación: Rol de usuario no definido.'
            });
        }

        const usuarioRol = req.usuario.tipo_usuario;

        if (!rolesPermitidos.includes(usuarioRol)) {
            return res.status(403).json({
                msg: 'Acceso denegado. Su rol no tiene permisos para esta acción.'
            });
        }
        next();
    };
};