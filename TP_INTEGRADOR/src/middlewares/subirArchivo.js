import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener la ruta absoluta de la carpeta uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadPath = path.resolve(__dirname, '../uploads');

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

// Filtro para aceptar solo imágenes
const fileFilter = (req, file, cb) => {
  const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (validTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos JPG o PNG'));
  }
};

// Crear instancia de Multer
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB
});
