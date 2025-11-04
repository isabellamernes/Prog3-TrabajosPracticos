import Salones from "../db/salones.js";

export default class SalonesServicio {
    constructor(){
        this.salones = new Salones();
    }

    buscarTodos = () => {
        return this.salones.buscarTodos();
    }

    buscarPorId = (salon_id) => {
        return this.salones.buscarPorId(salon_id);
    }

    modificar = async (salon_id, datos) => {
        const existe = await this.salones.buscarPorId(salon_id);
        if(!existe){
            return null;
        }
        return this.salones.modificar(salon_id, datos);
    }

    crear = (salon) => {
        return this.salones.crear(salon);
    }

    eliminar = async (salon_id) => {
        return await this.salones.eliminar(salon_id);
    };
}