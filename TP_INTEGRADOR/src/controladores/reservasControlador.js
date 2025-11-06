import ReservasServicio from "../servicios/reservasServicio.js";
const formatosPermitidos = ['pdf', 'csv'];

export default class ReservasControlador{
    constructor(){
        this.reservasServicio = new ReservasServicio();
    }

    crear = async (req, res) => {
        try {
            const usuario_id = req.user.usuario_id;
            
            const reserva = {
                ...req.body,
                usuario_id: usuario_id
            };

            const nuevaReserva = await this.reservasServicio.crear(reserva)
            if (!nuevaReserva) {
                return res.status(404).json({
                    estado: false,
                    mensaje: 'Reserva no creada'
                })
            }
            res.json({
                estado: true, 
                mensaje: 'Reserva creada!',
                salon: nuevaReserva
            });
        } catch (err) {
            console.log('Error en POST /reservas/', err);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }
    
    buscarTodos = async (req, res) => {
        try {
            const reservas = await this.reservasServicio.buscarTodos(req.user);
            res.json({
                estado: true, 
                datos: reservas
            });
        } catch (err) {
            console.log('Error en GET /reservas', err);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }

    buscarPorId = async (req, res) => {
        try {
            const reserva_id = req.params.reserva_id;
            const reserva = await this.reservasServicio.buscarPorId(reserva_id);
            if (!reserva) {
                return res.status(404).json({
                    estado: false,
                    mensaje: 'Reserva no encontrada.'
                })
            }
            res.json({
                estado: true, 
                reserva: reserva
            });
        } catch (err) {
            console.log('Error en GET /reservas/reservas_id', err);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }

    modificar = async (req, res) => {
        try {
            const reserva_id = req.params.reserva_id;
            const reservaModificada = await this.reservasServicio.modificar(reserva_id, req.body);
            if (!reservaModificada) {
                return res.status(404).json({ estado: false, mensaje: 'Reserva no encontrada.' });
            }
            res.json({ estado: true, mensaje: 'Reserva modificada!', reserva: reservaModificada });
        } catch (err) {
            res.status(500).json({ estado: false, mensaje: 'Error interno del servidor.' });
        }
    }

    eliminar = async (req, res) => {
        try {
            const reserva_id = req.params.reserva_id;
            const filasAfectadas = await this.reservasServicio.eliminar(reserva_id);
            if (filasAfectadas === 0) {
                return res.status(404).json({ estado: false, mensaje: 'Reserva no encontrada.' });
            }
            res.json({ estado: true, mensaje: 'Reserva eliminada (lógicamente).' });
        } catch (err) {
            res.status(500).json({ estado: false, mensaje: 'Error interno del servidor.' });
        }
    }

    informe = async (req, res) => {
        try{
            const formato = req.query.formato;
            if(!formato || !formatosPermitidos.includes(formato)){
                return res.status(400).send({
                    estado:"Falla",
                    mensaje: "Formato inválido para el informe."    
                })
            }
            
            const {buffer, path, headers} = await this.reservasServicio.generarInforme(formato);
            
            res.set(headers);
            if (formato === 'pdf') {
                res.status(200).end(buffer);
            } else if (formato === 'csv') {
                res.status(200).download(path, (err) => {
                    if (err) {
                        return res.status(500).send({
                            estado:"Falla",
                            mensaje: " No se pudo generar el informe."    
                        })
                    }
                })
            }
        }catch(error){
            console.log(error)
            res.status(500).send({
                estado:"Falla", mensaje: "Error interno en servidor."
            });
        } 
    }

    estadisticas = async (req, res) => {
        try{
            const stats = await this.reservasServicio.generarEstadisticas();
            res.json({
                estado: true,
                datos: stats
            });
        }catch(error){
            console.log(error)
            res.status(500).send({
                estado:"Falla", mensaje: "Error interno en servidor."
            });
        } 
    }
}