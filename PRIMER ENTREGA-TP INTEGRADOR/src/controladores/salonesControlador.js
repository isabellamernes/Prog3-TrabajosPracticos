import SalonesServicio from "../servicios/salonesServicio.js";
import { enviarMail } from "../utiles/enviarMail.js";

export default class SalonesControlador {
  constructor() {
    this.salonesServicio = new SalonesServicio();
  }

  buscarTodos = async (req, res) => {
    try {
      const salones = await this.salonesServicio.buscarTodos();
      res.json({ estado: true, datos: salones });
    } catch (err) {
      console.log("Error en GET /salones", err);
      res.status(500).json({ estado: false, mensaje: "Error interno del servidor." });
    }
  };

  buscarPorId = async (req, res) => {
    try {
      const salon_id = req.params.salon_id;
      const salon = await this.salonesServicio.buscarPorId(salon_id);

      if (!salon) {
        return res.status(404).json({ estado: false, mensaje: "Salón no encontrado." });
      }

      res.json({ estado: true, salon });
    } catch (err) {
      console.log("Error en GET /salones/:salon_id", err);
      res.status(500).json({ estado: false, mensaje: "Error interno del servidor." });
    }
  };

  crear = async (req, res) => {
    try {
      const { titulo, direccion, capacidad, importe } = req.body;
      const nuevoSalon = await this.salonesServicio.crear({ titulo, direccion, capacidad, importe });

      if (!nuevoSalon) {
        return res.status(400).json({ estado: false, mensaje: "No se pudo crear el salón." });
      }

      //  Enviar correo
      await enviarMail(
        process.env.USERCORREO,
        "Nuevo salón creado ",
        `
          <h2>Nuevo salón creado</h2>
          <p><strong>Título:</strong> ${titulo}</p>
          <p><strong>Dirección:</strong> ${direccion}</p>
          <p><strong>Capacidad:</strong> ${capacidad}</p>
          <p><strong>Importe:</strong> ${importe}</p>
          <hr>
          <p>Fecha: ${new Date().toLocaleString()}</p>
        `
      );

      res.json({ estado: true, mensaje: "Salón creado correctamente.", salon: nuevoSalon });
    } catch (err) {
      console.log("Error en POST /salones", err);
      res.status(500).json({ estado: false, mensaje: "Error interno del servidor." });
    }
  };

  editar = async (req, res) => {
    try {
      const salon_id = req.params.salon_id;
      const datos = req.body;
      const salonModificado = await this.salonesServicio.modificar(salon_id, datos);

      if (!salonModificado) {
        return res.status(404).json({ estado: false, mensaje: "Salón no encontrado para modificar." });
      }

      res.json({ estado: true, mensaje: "Salón modificado correctamente.", salon: salonModificado });
    } catch (err) {
      console.log("Error en PUT /salones/:salon_id", err);
      res.status(500).json({ estado: false, mensaje: "Error interno del servidor." });
    }
  };

  eliminar = async (req, res) => {
    try {
      const salon_id = req.params.salon_id;
      const eliminado = await this.salonesServicio.eliminar(salon_id);

      if (!eliminado) {
        return res.status(404).json({ estado: false, mensaje: "Salón no encontrado para eliminar." });
      }

      res.json({ estado: true, mensaje: "Salón eliminado correctamente." });
    } catch (err) {
      console.log("Error en DELETE /salones/:salon_id", err);
      res.status(500).json({ estado: false, mensaje: "Error interno del servidor." });
    }
  };
}

