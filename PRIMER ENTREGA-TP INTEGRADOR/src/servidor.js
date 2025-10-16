// src/servidor.js
import app from './reservas.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PUERTO || 3000;

app.listen(PORT, () => {
  console.log(` Servidor iniciado en puerto ${PORT}`);

});
