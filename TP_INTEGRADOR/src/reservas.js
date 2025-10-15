import express from 'express';

// importo rutas
import { router as v1SalonesRutas} from './v1/rutas/salonesRutas.js'

const app = express();

app.use(express.json());

app.use('/api/v1/salones', v1SalonesRutas);

export default app;