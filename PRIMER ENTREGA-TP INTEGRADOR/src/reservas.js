// src/reservas.js
import express from 'express';
import { router as v1SalonesRutas } from './v1/rutas/salonesRutas.js';

const app = express();

app.use(express.json());

console.log('🟢 Iniciando carga de rutas...');
app.use('/api/v1/salones', v1SalonesRutas);
console.log('✅ Rutas de salones montadas en /api/v1/salones');

app.get('/', (req, res) => {
  res.send('API funcionando correctamente ✅');
});

export default app;


