import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import adminRoutes from "./routes/adminRoutes.js";
import purchaseRoutes from "./routes/purchaseRoutes.js";
import raffleRoutes from "./routes/raffles.js";
import rateRoutes from "./routes/rateRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
//import userRoutes from './routes/userRoutes.js';

dotenv.config();

// Validar existencia de JWT_SECRET
if (!process.env.JWT_SECRET) {
  console.error("❌ ERROR: JWT_SECRET no está definido en el archivo .env");
  process.exit(1); // Detiene la ejecución del servidor
}

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(
  cors({
    origin: "http://localhost:8080", // ajusta al dominio/puerto de tu frontend
    credentials: true, // para que pase cookies/headers auth
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
//app.use('/api/users', userRoutes);

// ————————————————————————————————
// Middleware de manejo de errores (incluye Multer fileFilter)
app.use((err, req, res, next) => {
  console.error("🚨 Error capturado por el handler global:", err.message);

  // Si Multer llamó a cb(new Error('Formato de imagen no válido'), false)
  if (err.message === 'Formato de imagen no válido') {
    return res.status(400).json({ message: err.message });
  }

  // Si es error de Multer genérico
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({ message: 'Campo de archivo inesperado' });
  }

  // Para cualquier otro error, deja que Express lo maneje o devuelva 500
  next(err);
});
// ————————————————————————————————


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
