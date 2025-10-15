import mysql from 'mysql2/promise';

export const conexion = await mysql.createConnection({
  host: 'localhost',
  user: 'eileenmernes',
  database: 'reservas',
  password: 'eileenreservas'  
});
