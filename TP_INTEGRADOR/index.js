import express from 'express';
import handlebars from 'handlebars';
import nodemailer from 'nodemailer';
import { fileURLToPath} from 'url';
import { readFile } from 'fs/promises';
import path from 'path';
import salonesRoutes from './routes/salon.routes.js'; // IMPORTA LA RUTA DE SALONES

// instancia express
const app = express();

// las solicitus con un body las interpretamos como JSON
app.use(express.json());

// ruta del estado de api, sería como ver si esta activa la aplicación
app.get('/estado', (req, res) => {
    res.json({'ok':true});    
})

// ruta tipo POST, por ahora recibe datos, la completaremos con el envio de un correo electrónico
app.post('/notificacion', async (req, res) => {

    if(!req.body.fecha ||  !req.body.salon || !req.body.turno || !req.body.correoDestino){
        res.status(400).send({'estado':false, 'mensaje':'Faltan datos requeridos!'});
    }
    
    try{
        // obtengo los datos del cuerpo de la consulta, desestructurando
        const { fecha, salon, turno, correoDestino} = req.body;

        // necesito la ubicación de la plantilla, obtengo la ruta absoluta del archivo
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);        
        const plantilla = path.join(__dirname, 'utiles', 'handlebars', 'plantilla.hbs');

        // leo la plantilla handlebars, compilo y le paso los datos que llegaron
        const archivoHbs = await readFile(plantilla, 'utf-8');

        const template = handlebars.compile(archivoHbs);

        var html = template(
            {   fecha: fecha, 
                salon: salon,
                turno: turno
            }
        );
        

        // servicio, usuario y password para el envio de correo electrónico
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.USER,
                pass: process.env.PASS,
            },
        });

        // las opciones para el envio, importante "html" (handlebars)
        const opciones = {
            to: correoDestino,
            subject: 'Notificación',
            html: html
        }

        // envío el correo electrónico
        transporter.sendMail(opciones, (error, info) => {
            if(error){
                res.json({'ok':false, 'mensaje':'Error al enviar el correo.'});           
            }
            res.json({'ok': true, 'mensaje': 'Correo enviado.'});
        });

    }catch (error){
        console.log(error);
    }
})

// **********************************************
// MONTA LAS RUTAS MODULARIZADAS DE LOS SALONES
// **********************************************
app.use('/api/salones', salonesRoutes); 

// cargo las varibales de entorno
process.loadEnvFile();

// lanzo mi servidor express
app.listen(process.env.PUERTO, () => {
    console.log(`Servidor iniciado en ${process.env.PUERTO}`);
})