import jwt from 'jsonwebtoken';
import passport from 'passport';
import UsuariosService from "../servicios/usuariosServicio.js";

export default class AuthControlador{
    login = async (req, res) => {        
        passport.authenticate('local', {session: false}, (err, usuario, info) => {
            if (err || !usuario) {
                return res.status(400).json({
                    estado: false,
                    mensaje: "Solicitud incorrecta." 
                })
            }
            
            req.login(usuario, { session: false }, (err) => {
                if(err){
                    res.send(err);
                }
                const token = jwt.sign(usuario, process.env.JWT_SECRET, { expiresIn: '1h'});

                return res.json({
                    estado: true, 
                    token: token
                });
            })
        })(req, res);
    }

    register = async (req, res) => {
        // 0. Instanciamos el servicio de usuarios
        const usuariosService = new UsuariosService();

        try {
            // 1. Tomamos los datos del body
            const datosUsuario = req.body;

            // 2. Asignamos tipo_usuario = 3 (cliente)
            datosUsuario.tipo_usuario = 3; 

            // 3. Añadimos 'foto: null'
            datosUsuario.foto = datosUsuario.foto || null;

            // 4. Intentamos crear el usuario
            const nuevoUsuario = await usuariosService.crear(datosUsuario);
            
            if (!nuevoUsuario) {
                return res.status(400).json({ 
                    estado: false, 
                    mensaje: 'No se pudo crear el usuario. ¿El email ya existe?' 
                });
            }

            // 5. Devolvemos una respuesta exitosa (sin token,
            // el usuario debe loguearse después)
            res.status(201).json({ 
                estado: true, 
                mensaje: 'Usuario cliente registrado con éxito!', 
                usuario: {
                    usuario_id: nuevoUsuario.usuario_id,
                    nombre: nuevoUsuario.nombre,
                    apellido: nuevoUsuario.apellido,
                    nombre_usuario: nuevoUsuario.nombre_usuario
                }
            });

        } catch (err) {
            console.log('Error en POST /register', err);
            res.status(500).json({ 
                estado: false, 
                mensaje: 'Error interno del servidor.' 
            });
        }
    }
}