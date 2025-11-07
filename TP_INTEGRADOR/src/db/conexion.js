import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

export const conexion = await mysql.createConnection({
  host: process.env.HOST,      
  user: process.env.USER,
  database: process.env.DATABASE,
  password: process.env.PASSWORD
});
