import express from "express";
import dbConfig from "./config/db.config.js";
import salonesRoutes from "./routes/salones.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ "mensaje": "¡Bienvenido a la API de PROGIII!" });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}.`);
});


app.use("/api/salones", salonesRoutes);