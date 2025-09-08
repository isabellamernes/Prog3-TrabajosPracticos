import mysql from "mysql2/promise";
import dbConfig from "./db.config.js";

const pool = mysql.createPool({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB
});

export default pool;