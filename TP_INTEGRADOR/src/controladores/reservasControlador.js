// src/controladores/reservasControlador.js
import ReservasServicio from "../servicios/reservasServicio.js";

const formatosPermitidos = ['pdf', 'csv'];

export default class ReservasControlador {
    constructor() {
        this.reservasServicio = new ReservasServicio();
    }

    //  Crear nueva reserva con imagen opcional
    crear = async (req, res) => {
        try {
          // usuario desde token
          const usuario_id = req.user?.usuario_id;
    
          // parseamos datos que vienen en form-data (campo "datos")
          let body;
          if (req.body && req.body.datos) {
            try {
              body = JSON.parse(req.body.datos);
            } catch (err) {
              return res.status(400).json({ estado: "Falla", mensaje: "JSON inválido en campo datos." });
            }
          } else {
            body = req.body;
          }
    
          // archivo
          const foto_cumpleaniero = req.file ? req.file.filename : null;
    
          // validaciones básicas (manuales)
          if (!body.fecha_reserva || !body.salon_id || !body.turno_id || !Array.isArray(body.servicios) || body.servicios.length === 0) {
            return res.status(400).json({
              estado: "Falla",
              mensaje: "Faltan campos obligatorios en la reserva (fecha_reserva, salon_id, turno_id, servicios)."
            });
          }
    
          const reserva = {
            ...body,
            usuario_id,
            foto_cumpleaniero
          };
    
          const nuevaReserva = await this.reservasServicio.crear(reserva);
          if (!nuevaReserva) {
            return res.status(500).json({ estado: false, mensaje: "Reserva no creada" });
          }
    
          return res.json({ estado: true, mensaje: "Reserva creada!", reserva: nuevaReserva });
        } catch (err) {
          console.error("Error en POST /reservas/", err);
          return res.status(500).json({ estado: false, mensaje: "Error interno del servidor." });
        }
      }





    // Buscar todas las reservas (según usuario)
    buscarTodos = async (req, res) => {
        try {
            const reservas = await this.reservasServicio.buscarTodos(req.user);
            res.json({
                estado: true,
                datos: reservas
            });
        } catch (err) {
            console.log("Error en GET /reservas", err);
            res.status(500).json({
                estado: false,
                mensaje: "Error interno del servidor."
            });
        }
    }

    //  Buscar una reserva por ID
    buscarPorId = async (req, res) => {
        try {
            const reserva_id = req.params.reserva_id;
            const reserva = await this.reservasServicio.buscarPorId(reserva_id);

            if (!reserva) {
                return res.status(404).json({
                    estado: false,
                    mensaje: "Reserva no encontrada."
                });
            }

            res.json({
                estado: true,
                reserva
            });
        } catch (err) {
            console.log("Error en GET /reservas/:reserva_id", err);
            res.status(500).json({
                estado: false,
                mensaje: "Error interno del servidor."
            });
        }
    }

    //  Modificar reserva
    modificar = async (req, res) => {
        try {
            const reserva_id = req.params.reserva_id;
            const reservaModificada = await this.reservasServicio.modificar(reserva_id, req.body);

            if (!reservaModificada) {
                return res.status(404).json({
                    estado: false,
                    mensaje: "Reserva no encontrada."
                });
            }

            res.json({
                estado: true,
                mensaje: "Reserva modificada!",
                reserva: reservaModificada
            });

        } catch (err) {
            console.log("Error en PUT /reservas/:reserva_id", err);
            res.status(500).json({
                estado: false,
                mensaje: "Error interno del servidor."
            });
        }
    }

    //  Eliminar (lógicamente)
    eliminar = async (req, res) => {
        try {
            const reserva_id = req.params.reserva_id;
            const filasAfectadas = await this.reservasServicio.eliminar(reserva_id);

            if (filasAfectadas === 0) {
                return res.status(404).json({
                    estado: false,
                    mensaje: "Reserva no encontrada."
                });
            }

            res.json({
                estado: true,
                mensaje: "Reserva eliminada (lógicamente)."
            });

        } catch (err) {
            console.log("Error en DELETE /reservas/:reserva_id", err);
            res.status(500).json({
                estado: false,
                mensaje: "Error interno del servidor."
            });
        }
    }

    //  Generar informe en PDF o CSV
    informe = async (req, res) => {
        try {
            const formato = req.query.formato;
            if (!formato || !formatosPermitidos.includes(formato)) {
                return res.status(400).send({
                    estado: "Falla",
                    mensaje: "Formato inválido para el informe."
                });
            }

            const { buffer, path, headers } = await this.reservasServicio.generarInforme(formato);

            res.set(headers);
            if (formato === "pdf") {
                res.status(200).end(buffer);
            } else if (formato === "csv") {
                res.status(200).download(path, (err) => {
                    if (err) {
                        return res.status(500).send({
                            estado: "Falla",
                            mensaje: "No se pudo generar el informe."
                        });
                    }
                });
            }
        } catch (error) {
            console.log(error);
            res.status(500).send({
                estado: "Falla",
                mensaje: "Error interno en servidor."
            });
        }
    }
    

    estadisticas = async (req, res) => {
        try{
            // 1. Leemos el formato (ej: ?formato=pdf)
            const formato = req.query.formato;
            
            // 2. Pasamos el formato al servicio
            const resultado = await this.reservasServicio.generarEstadisticas(formato);
            
            // 3. Verificamos qué nos devolvió el servicio
            if (formato === 'pdf') {
                // Si pedimos PDF, enviamos el buffer
                res.set(resultado.headers);
                res.status(200).end(resultado.buffer);
            } else {
                // Si no, enviamos el JSON
                res.json({
                    estado: true,
                    datos: resultado
                });
            }
        }catch(error){
            console.log(error)
            res.status(500).send({
                estado:"Falla", mensaje: "Error interno en servidor."
            });
        } 
    }
}

