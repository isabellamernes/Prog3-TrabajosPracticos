// src/config/passport.js
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import UsuariosService from "../servicios/usuariosServicio.js";

// Estrategia Local (para el Login)
const estrategia = new LocalStrategy({
    usernameField: 'nombre_usuario', 
    passwordField: 'contrasenia'
}, 
    async (nombre_usuario, contrasenia, done) => {
        try{
            const usuariosServicio = new UsuariosService();
            const usuario = await usuariosServicio.buscar(nombre_usuario, contrasenia);
            if(!usuario){
                return done(null, false, { mensaje: 'Login incorrecto!'})
            }
            return done(null, usuario, { mensaje: 'Login correcto!'})
        }
        catch(exc){
            done(exc);
        }
    }
);

// Estrategia JWT (para validar el Token)
const validacion = new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
    secretOrKey: process.env.JWT_SECRET 
},
    async (jwtPayload, done) => {
        const usuariosServicio = new UsuariosService();
        const usuario = await usuariosServicio.buscarPorId(jwtPayload.usuario_id);
        if(!usuario){
            return done(null, false, { mensaje: 'Token incorrecto!'});
        }
        return done(null, usuario); 
    }    
);

export { estrategia, validacion };