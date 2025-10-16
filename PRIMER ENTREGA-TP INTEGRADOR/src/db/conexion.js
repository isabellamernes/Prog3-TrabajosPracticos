import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Carga las variables desde el archivo .env
dotenv.config();

let conexion;

try {
  conexion = await mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  });

  console.log(" Conexión exitosa a la base de datos MySQL");
} catch (error) {
  console.error(" Error de conexión a MySQL:", error);
}

// Exportamos la conexión para usarla en otros archivos
export { conexion };

