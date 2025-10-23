// src/controllers/authControlador.js
import AuthServicio from '../services/authServicio.js'; 
export default class AuthControlador {

    constructor() {
        this.servicio = new AuthServicio();
    }

    /**
     * Maneja la petición de login.
     */
    login = async (req, res) => {
        // Los datos ya vienen validados por express-validator (ver rutas)
        const { nombre_usuario, contrasenia } = req.body;

        try {
            const token = await this.servicio.login(nombre_usuario, contrasenia);

            if (!token) {
                // Si el servicio devuelve null, es un fallo de autenticación (usuario/pass incorrectos)
                return res.status(401).json({ // 401 Unauthorized
                    estado: false,
                    mensaje: 'Credenciales inválidas.'
                });
            }

            // ¡Login exitoso! Devolvemos el token
            res.status(200).json({
                estado: true,
                mensaje: 'Login exitoso.',
                token: token // El cliente debe guardar este token
            });

        } catch (error) {
            // Si el servicio lanza un error, es un error interno (ej: fallo DB)
            console.error("Error en AuthControlador -> login:", error);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor durante el login.'
            });
        }
    }
}