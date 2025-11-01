//configuracion de mi aplicacion  -- comentario mica gomez -- no borrar

import express from 'express';

// importo rutas
import { router as v1SalonesRutas} from './v1/rutas/salonesRutas.js'
import { router as v1ReservasRutas} from './v1/rutas/reservasRutas.js'

const app = express();

app.use(express.json());

app.use('/api/v1/salones', v1SalonesRutas);
app.use('/api/v1/reservas', v1ReservasRutas);


export default app;