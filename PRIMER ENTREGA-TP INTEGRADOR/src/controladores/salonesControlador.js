import SalonesServicio from "../servicios/salonesServicio.js";
import { enviarMail } from "../utiles/enviarMail.js";


console.log(' Controlador de salones cargado correctamente');


export default class SalonesControlador {
  constructor() {
    this.servicio = new SalonesServicio();
  }

  //  GET /salones
  buscarTodos = async (req, res) => {
    try {
      const salones = await this.servicio.buscarTodos();
      res.json({ estado: true, datos: salones });
    } catch (err) {
      console.error("Error en buscarTodos:", err);
      res
        .status(500)
        .json({ estado: false, mensaje: "Error interno del servidor" });
    }
  };

  //  GET /salones/:salon_id
  buscarPorId = async (req, res) => {
    try {
      const { salon_id } = req.params;
      const salon = await this.servicio.buscarPorId(salon_id);
      if (!salon) {
        return res
          .status(404)
          .json({ estado: false, mensaje: "Salón no encontrado" });
      }
      res.json({ estado: true, datos: salon });
    } catch (err) {
      console.error("Error en buscarPorId:", err);
      res
        .status(500)
        .json({ estado: false, mensaje: "Error interno del servidor" });
    }
  };

  //  POST /salones
  crear = async (req, res) => {
    try {
      const { titulo, direccion, capacidad, importe } = req.body;
      if (!titulo || !direccion || !capacidad || !importe) {
        return res
          .status(400)
          .json({ estado: false, mensaje: "Faltan campos requeridos" });
      }

      const insertId = await this.servicio.crear({
        titulo,
        direccion,
        capacidad,
        importe,
      });

      console.log(" Intentando enviar correo...");

      //  Llamar a la función enviarMail
      const resultadoCorreo = await enviarMail(
        process.env.USERCORREO,
        "Nuevo salón creado ",
        `
          <h2>Nuevo salón registrado</h2>
          <p><strong>Título:</strong> ${titulo}</p>
          <p><strong>Dirección:</strong> ${direccion}</p>
          <p><strong>Capacidad:</strong> ${capacidad}</p>
          <p><strong>Importe:</strong> ${importe}</p>
          <hr>
          <p>Fecha: ${new Date().toLocaleString()}</p>
        `
      );
  
      console.log(" Resultado de enviarMail:", resultadoCorreo);
  
      res.status(201).json({
        estado: true,
        mensaje: `Salón creado con ID ${insertId}`,
      });
    } catch (err) {
      console.error(" Error en crear:", err);
      res
        .status(500)
        .json({ estado: false, mensaje: "Error interno del servidor" });
    }
  };
  

    







  //  PUT /salones/:salon_id
  editar = async (req, res) => {
    try {
      const { salon_id } = req.params;
      const { titulo, direccion, capacidad, importe } = req.body;

      const salon = await this.servicio.buscarPorId(salon_id);
      if (!salon) {
        return res
          .status(404)
          .json({ estado: false, mensaje: "El salón no existe" });
      }

      if (!titulo || !direccion || !capacidad || !importe) {
        return res
          .status(400)
          .json({ estado: false, mensaje: "Faltan campos requeridos" });
      }

      await this.servicio.editar(salon_id, {
        titulo,
        direccion,
        capacidad,
        importe,
      });

      res.json({ estado: true, mensaje: "Salón actualizado correctamente" });
    } catch (err) {
      console.error("Error en editar:", err);
      res
        .status(500)
        .json({ estado: false, mensaje: "Error interno del servidor" });
    }
  };

  // DELETE /salones/:salon_id
  eliminar = async (req, res) => {
    try {
      const { salon_id } = req.params;
      const salon = await this.servicio.buscarPorId(salon_id);
      if (!salon) {
        return res
          .status(404)
          .json({ estado: false, mensaje: "El salón no existe" });
      }

      await this.servicio.eliminar(salon_id);
      res.json({ estado: true, mensaje: "Salón eliminado correctamente" });
    } catch (err) {
      console.error("Error en eliminar:", err);
      res
        .status(500)
        .json({ estado: false, mensaje: "Error interno del servidor" });
    }
  };
}
