import { createObjectCsvWriter } from 'csv-writer';
import puppeteer from "puppeteer"; 
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

handlebars.registerHelper('increment', function (value) {
  return parseInt(value) + 1;
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class InformeServicio {
    
    informeReservasCsv = async (datosReporte) => {
        try{
            let ruta = path.resolve(__dirname, '../utiles'); 
            ruta = path.join(ruta, 'reservas.csv'); 

            const csvWriter = createObjectCsvWriter({
                path: ruta,
                header: [
                    { id: 'nombre', title: 'Nombre' },
                    { id: 'fecha_reserva', title: 'Fecha Reserva' },
                    { id: 'salon', title: 'Salón' },
                    { id: 'servicios', title: 'Servicios' },
                    { id: 'turno', title: 'Turno' },
                    { id: 'orden', title: 'Orden' }
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
            const plantillaPath  = path.join(__dirname, '../utiles/handlebars/informe.hbs');
            const plantillaHtml = fs.readFileSync(plantillaPath , 'utf8');
            
            const template = handlebars.compile(plantillaHtml);
            const htmlFinal = template({ reservas: datosReporte }); 
            
            let browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });

            let page = await browser.newPage();
            await page.setContent(htmlFinal);
            const buffer = await page.pdf({
                format: 'A4', 
                printBackground: true
            });

            await browser.close();
            return buffer;

        }catch(error){
            console.error('Error generando el PDF:', error);
            throw error;
        }
    }

    informeEstadisticasPdf = async (datos) => {
        try{
            // Apuntamos a la NUEVA plantilla
            const plantillaPath  = path.join(__dirname, '../utiles/handlebars/estadisticas.hbs');
            const plantillaHtml = fs.readFileSync(plantillaPath , 'utf8');
            
            const template = handlebars.compile(plantillaHtml);
            // Pasamos los datos (que tendrán el formato { top_salones: [...] })
            const htmlFinal = template(datos); 
            
            let browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });

            let page = await browser.newPage();
            await page.setContent(htmlFinal);
            const buffer = await page.pdf({
                format: 'A4', 
                printBackground: true
            });

            await browser.close();
            return buffer;

        }catch(error){
            console.error('Error generando el PDF de estadísticas:', error);
            throw error;
        }
    }
}