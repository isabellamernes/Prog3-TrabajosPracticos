import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOADS_DIR = path.join(__dirname, '../../uploads');
const PUBLIC_URL_PREFIX = '/uploads/';

// Subir un solo archivo
export const subirArchivo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se ha proporcionado ningún archivo' });
    }

    res.status(200).json({
      mensaje: 'Archivo subido exitosamente',
      archivo: {
        nombre: req.file.filename,
        nombreOriginal: req.file.originalname,
        mimetype: req.file.mimetype,
        tamaño: req.file.size,
        ruta: PUBLIC_URL_PREFIX + req.file.filename
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al subir el archivo', detalle: error.message });
  }
};

//  Subir múltiples archivos
export const subirMultiplesArchivos = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No se han proporcionado archivos' });
    }

    const archivos = req.files.map(file => ({
      nombre: file.filename,
      nombreOriginal: file.originalname,
      mimetype: file.mimetype,
      tamaño: file.size,
      ruta: PUBLIC_URL_PREFIX + file.filename
    }));

    res.status(200).json({
      mensaje: `${req.files.length} archivo(s) subido(s) exitosamente`,
      archivos
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al subir los archivos', detalle: error.message });
  }
};

// Eliminar archivo
export const eliminarArchivo = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(UPLOADS_DIR, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }

    fs.unlinkSync(filePath);
    res.status(200).json({ mensaje: 'Archivo eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el archivo', detalle: error.message });
  }
};

// Listar archivos
export const listarArchivos = async (req, res) => {
  try {
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }

    const files = fs.readdirSync(UPLOADS_DIR);

    const archivos = files.map(file => {
      const stats = fs.statSync(path.join(UPLOADS_DIR, file));
      return {
        nombre: file,
        tamaño: stats.size,
        fechaCreacion: stats.birthtime,
        ruta: PUBLIC_URL_PREFIX + file
      };
    });

    res.status(200).json({ total: archivos.length, archivos });
  } catch (error) {
    res.status(500).json({ error: 'Error al listar archivos', detalle: error.message });
  }
};
