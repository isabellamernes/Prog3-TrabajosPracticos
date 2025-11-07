import express from 'express';
import passport from 'passport';
import { upload, handleMulterError } from '../../config/multer.js';
import {
  subirArchivo,
  subirMultiplesArchivos,
  eliminarArchivo,
  listarArchivos
} from '../../controladores/uploadControlador.js';

const router = express.Router();

// Subir un solo archivo
router.post(
  '/single',
  passport.authenticate('jwt', { session: false }),
  upload.single('archivo'),
  handleMulterError,
  subirArchivo
);

// Subir múltiples archivos (hasta 10)
router.post(
  '/multiple',
  passport.authenticate('jwt', { session: false }),
  upload.array('archivos', 10),
  handleMulterError,
  subirMultiplesArchivos
);

// Eliminar un archivo por nombre
router.delete(
  '/:filename',
  passport.authenticate('jwt', { session: false }),
  eliminarArchivo
);

// Listar todos los archivos subidos
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  listarArchivos
);

export default router;
