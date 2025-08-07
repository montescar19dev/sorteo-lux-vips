// server/routes/raffles.js
import express from "express";
import Raffle from "../models/Raffle.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Crear una nueva rifa con subida de imagen
router.post(
  "/",
  authMiddleware,
  upload.single("prizeImage"), // campo multipart “prizeImage”
  async (req, res) => {
    try {
      // Si Multer rechazó la imagen (req.file undefined), devolvemos JSON
      if (!req.file) {
        return res.status(400).json({ message: "Formato de imagen no válido" });
      }

      // Leer campos de texto
      const {
        title,
        description,
        ticketPrice,
        totalTickets,
        endDate,
        minTicketsPerUser,
      } = req.body;

      // Convertir a tipos correctos
      const price = Number(ticketPrice);
      const total = Number(totalTickets);
      const endsAt = new Date(endDate);

      // Validación básica de los datos
      if (!title || isNaN(price) || isNaN(total) || !endsAt.getTime()) {
        return res.status(400).json({ message: "Datos inválidos" });
      }

      // URL pública de Cloudinary (ya subió Multer+CloudinaryStorage)
      const imageUrl = req.file.path;

      // Construir y guardar la rifa
      const newRaffle = new Raffle({
        title,
        description,
        ticketPrice: price,
        totalTickets: total,
        endDate: endsAt,
        imageUrl,
        minTicketsPerUser: Number(minTicketsPerUser),
      });

      const saved = await newRaffle.save();
      res.status(201).json(saved);
    } catch (error) {
      console.error("Error al crear rifa:", error);
      res.status(500).json({ message: "Error al crear rifa" });
    }
  }
);

// Obtener todas las rifas (solo para admins autenticados)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const raffles = await Raffle.find().sort({ createdAt: -1 });
    res.json(raffles);
  } catch (err) {
    console.error("Error al obtener rifas:", err);
    res.status(500).json({ message: "Error al obtener rifas" });
  }
});

// Ruta pública: Obtener solo rifas activas
// Ruta pública: Obtener rifas activas y pausadas, auto-marcando expiradas
router.get("/active", async (req, res) => {
  try {
    const now = new Date();

    // 1) Auto-marca como 'ended' las rifas que ya expiraron
    await Raffle.updateMany(
      { status: "active", endDate: { $lte: now } },
      { status: "ended" }
    );

    // 2) Devuelve rifas que estén 'active' o 'paused'
    const raffles = await Raffle.find({
      status: { $in: ["active", "paused"] },
    }).sort({ createdAt: -1 });

    res.json(raffles);
  } catch (err) {
    console.error("Error al obtener rifas publicas:", err);
    res.status(500).json({ message: "Error al obtener rifas publicas" });
  }
});

// ——— Eliminar una rifa (requiere contraseña) ———
router.delete("/:id", authMiddleware, async (req, res) => {
  const { password } = req.body;
  // Comprueba contraseña de entorno
  if (password !== process.env.ADMIN_DELETE_PASSWORD) {
    return res.status(403).json({ message: "Contraseña incorrecta" });
  }
  try {
    const result = await Raffle.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: "Rifa no encontrada" });
    res.json({ message: "Rifa eliminada" });
  } catch (err) {
    console.error("Error al eliminar rifa:", err);
    res.status(500).json({ message: "Error al eliminar rifa" });
  }
});

// ─── Actualizar rifa existente ─────────────────────────────────────────────
router.put(
  "/:id",
  authMiddleware,
  upload.fields([
    { name: "prizeImage", maxCount: 1 },
    { name: "winnerImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = {};

      // — Título —
      if (req.body.title !== undefined) {
        if (!req.body.title.trim()) {
          return res.status(400).json({ message: "Título inválido" });
        }
        updateData.title = req.body.title;
      }

      // — Descripción —
      if (req.body.description !== undefined) {
        if (!req.body.description.trim()) {
          return res.status(400).json({ message: "Descripción inválida" });
        }
        updateData.description = req.body.description;
      }

      // — Precio del ticket —
      if (req.body.ticketPrice !== undefined) {
        const price = Number(req.body.ticketPrice);
        if (isNaN(price)) {
          return res.status(400).json({ message: "Precio inválido" });
        }
        updateData.ticketPrice = price;
      }

      // — Total de boletos —
      if (req.body.totalTickets !== undefined) {
        const total = Number(req.body.totalTickets);
        if (isNaN(total)) {
          return res.status(400).json({ message: "Total de boletos inválido" });
        }
        updateData.totalTickets = total;
      }

      // — Fecha final —
      if (req.body.endDate !== undefined) {
        const endsAt = new Date(req.body.endDate);
        if (!endsAt.getTime()) {
          return res.status(400).json({ message: "Fecha inválida" });
        }
        updateData.endDate = endsAt;
      }

      // — Mínimo de tickets por usuario —
      if (req.body.minTicketsPerUser !== undefined) {
        const min = Number(req.body.minTicketsPerUser);
        if (isNaN(min) || min < 1) {
          return res
            .status(400)
            .json({ message: "Mínimo de tickets inválido" });
        }
        updateData.minTicketsPerUser = min;
      }

      // — Permitir cambiar status —
      if (req.body.status) {
        const allowed = ["active", "paused", "ended"];
        if (!allowed.includes(req.body.status)) {
          return res.status(400).json({ message: "Status inválido" });
        }
        updateData.status = req.body.status;
      }

      // — Permitir asignar ganador (nombre) —
      if (req.body.winner) {
        updateData.winner = req.body.winner;
      }

      // — Si subieron nueva imagen de premio —
      if (req.files?.prizeImage?.[0]) {
        updateData.imageUrl = req.files.prizeImage[0].path;
      }

      // — Si subieron foto del ganador —
      if (req.files?.winnerImage?.[0]) {
        updateData.winnerImage = req.files.winnerImage[0].path;
      }

      // Ejecutamos la actualización y devolvemos el documento nuevo
      const updated = await Raffle.findByIdAndUpdate(id, updateData, {
        new: true,
      });
      if (!updated) {
        return res.status(404).json({ message: "Sorteo no encontrado" });
      }
      res.json(updated);
    } catch (error) {
      console.error("Error al actualizar rifa:", error);
      res.status(500).json({ message: "Error al actualizar rifa" });
    }
  }
);
// ─────────────────────────────────────────────────────────────────────────────

export default router;
