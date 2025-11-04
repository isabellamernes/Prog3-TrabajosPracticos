// src/services/informesServicio.js
import { createObjectCsvWriter } from 'csv-writer';
import puppeteer from "puppeteer"; 
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class InformeServicio {
    
    informeReservasCsv = async (datosReporte) => {
        try{
            let ruta = path.resolve(__dirname, '../../utiles'); 
            ruta = path.join(ruta, 'reservas.csv'); 

            const csvWriter = createObjectCsvWriter({
                path: ruta,
                header: [
                    {id: 'fecha_reserva', title: 'Fecha reserva'},
                    {id: 'titulo', title: 'Título'},
                    {id: 'orden', title: 'Orden'}
                ]
            });
            
            await csvWriter.writeRecords(datosReporte);
            return ruta; 
            
        }catch (error){
            console.log(`Error generando csv ${error}`);
            throw error;
        }
    }

    informeReservasPdf = async (datosReporte) => {
        try{
            // 1. Lee la plantilla HBS
            const plantillaPath  = path.join(__dirname, '../utiles/handlebars/informe.hbs');
            const plantillaHtml = fs.readFileSync(plantillaPath , 'utf8');
            
            // 2. Compila la plantilla con los datos
            const template = handlebars.compile(plantillaHtml);
            const htmlFinal = template({ reservas: datosReporte }); // Pasamos los datos
            
            // 3. Inicia Puppeteer
            let browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });

            // 4. Genera el PDF en memoria (Buffer)
            let page = await browser.newPage();
            await page.setContent(htmlFinal);
            const buffer = await page.pdf({
                format: 'A4', 
                printBackground: true
            });

            await browser.close();

            // 5. Devuelve el buffer
            return buffer;

        }catch(error){
            console.error('Error generando el PDF:', error);
            throw error;
        }
    }
}