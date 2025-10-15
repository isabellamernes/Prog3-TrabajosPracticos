import SalonesServicio from "../servicios/salonesServicio.js";

export default class SalonesControlador{

    constructor(){
        this.salonesServicio = new SalonesServicio();
    }

    buscarTodos = async (req, res) => {
        try {
            const salones = await this.salonesServicio.buscarTodos();

            res.json({
                estado: true, 
                datos: salones
            });
    
        } catch (err) {
            console.log('Error en GET /salones', err);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }

    buscarPorID = async (req, res) => {
        try {
            const salon_id = req.params.salon_id;
            const salon = await this.salonesServicio.buscarPorId(salon_id);

            if (!salon) {
                return res.status(404).json({
                    estado: false,
                    mensaje: 'Salón no encontrado.'
                })
            }

            res.json({
                estado: true, 
                salon: salon
            });
    
        } catch (err) {
            console.log('Error en GET /salones/salon_id', err);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }
    
    modificar = async (req, res) => {
        try {
            const salon_id = req.params.salon_id;
            const datos = req.body;

            const salonModificado = await this.salonesServicio.modificar(salon_id, datos);

            if (!salonModificado) {
                return res.status(404).json({
                    estado: false,
                    mensaje: 'Salón no encontrado para ser modificado.'
                })
            }

            res.json({
                estado: true, 
                mensaje: 'Salón modificado!',
                salon: salonModificado
            });
    
        } catch (err) {
            console.log('Error en PUT /salones/:salon_id', err);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }

    crear = async (req, res) => {
        try {
            const {titulo, direccion, capacidad, importe} = req.body;

            const salon =  {
                titulo, 
                direccion, 
                capacidad, 
                importe
            }
            
            const nuevoSalon = await this.salonesServicio.crear(salon);

            if (!nuevoSalon) {
                return res.status(404).json({
                    estado: false,
                    mensaje: 'Salón no creado'
                })
            }

            res.json({
                estado: true, 
                mensaje: 'Salón creado!',
                salon: nuevoSalon
            });
    
        } catch (err) {
            console.log('Error en POST /salones/', err);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }

    eliminar = async (req, res) => {
        try {
        const salon_id = Number.parseInt(req.params.salon_id, 10);
        if (!Number.isFinite(salon_id)) {
        return res.status(400).json({ estado: false, mensaje: 'salon_id inválido.' });
    }

        const eliminado = await this.salonesServicio.eliminar(salon_id);
        if (!eliminado) {
        return res.status(404).json({ estado: false, mensaje: 'Salón no encontrado.' });
    }

        return res.json({
        estado: true,
        mensaje: 'Salón eliminado.',
        salon: eliminado
    });
    } catch (err) {
        console.log('Error en DELETE /salones/:salon_id', err);
        return res.status(500).json({ estado: false, mensaje: 'Error interno del servidor.' });
    }
};
}