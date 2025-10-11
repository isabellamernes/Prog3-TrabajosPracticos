// middlewares/verificar-jwt.js

import jwt from 'jsonwebtoken';

// Clave secreta para verificar la firma del token (DEBE ESTAR EN .env)
const SECRET = process.env.JWT_SECRET || 'mi_clave_secreta_fallback';

export const verificarJWT = (req, res, next) => {
    // 1. Obtener el token del encabezado Authorization
    const token = req.header('x-token') || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({
            msg: 'Acceso denegado. No se proporcionó token en la solicitud.'
        });
    }

    try {
        // 2. Verificar la firma del token
        const payload = jwt.verify(token, SECRET);
        
        // 3. Adjuntar el payload (datos del usuario) a la request
        // Asumiendo que el payload incluye { usuario_id, tipo_usuario, nombre_usuario }
        req.usuario = payload; 

        next();

    } catch (error) {
        // 4. Manejar tokens inválidos o expirados
        if (error.name === 'TokenExpiredError') {
             return res.status(401).json({ msg: 'Token expirado.' });
        }
        if (error.name === 'JsonWebTokenError') {
             return res.status(401).json({ msg: 'Token inválido.' });
        }
        console.error("Error al verificar JWT:", error);
        return res.status(500).json({ msg: 'Error interno al procesar el token.' });
    }
}