import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import adminRoutes from "./routes/adminRoutes.js";
import purchaseRoutes from "./routes/purchaseRoutes.js";
import raffleRoutes from "./routes/raffles.js";
import rateRoutes from "./routes/rateRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";

dotenv.config();

// Validar existencia de JWT_SECRET
if (!process.env.JWT_SECRET) {
  console.error("❌ ERROR: JWT_SECRET no está definido en el archivo .env");
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Configuración de CORS
const allowedOrigins = [
  "http://localhost:8080", // Para desarrollo local
  "https://sorteo-lux-vips.vercel.app", // Para producción en Vercel (antiguo)
  "https://raffle-project-portfolio.vercel.app", // Para producción en Vercel (nuevo)
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir solicitudes sin origen (como Postman o curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("No permitido por CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use("/api/admin", adminRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/raffles", raffleRoutes);
app.use("/api/rates", rateRoutes);
app.use("/api/stats", statsRoutes);

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error("🚨 Error capturado por el handler global:", err.message);

  if (err.message === "Formato de imagen no válido") {
    return res.status(400).json({ message: err.message });
  }

  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    return res.status(400).json({ message: "Campo de archivo inesperado" });
  }

  // Para otros errores, devolver un 500
  res.status(500).json({ message: "Error interno del servidor" });
});

app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente");
});

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Conexión exitosa a MongoDB Atlas");
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error al conectar con MongoDB:", error);
  });
