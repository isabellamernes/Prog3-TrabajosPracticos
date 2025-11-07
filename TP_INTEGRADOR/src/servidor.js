import app from './reservas.js';
import dotenv from 'dotenv';

dotenv.config(); // Carga el .env automáticamente

const PUERTO = process.env.PUERTO || 3000;

app.listen(PUERTO, () => {
  console.log(` Servidor iniciado en el puerto ${PUERTO}`);
});
