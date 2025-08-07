import express from "express";
import Purchase from "../models/Purchase.js";
import { verifyToken } from "../middleware/auth.js"; // si usas autenticación
import { createPurchase } from "../controllers/purchaseController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Obtener todas las compras (solo admins)
router.get("/", verifyToken, async (req, res) => {
  try {
    const purchases = await Purchase.find()
      .sort({ createdAt: -1 })
      .populate("raffleId");
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las compras" });
  }
});

// Registrar una nueva compra con imagen
router.post("/", upload.single("screenshot"), createPurchase);

// Actualizar el estado de una compra
router.patch("/:id/status", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["pending", "verified", "rejected"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Estado inválido" });
  }

  try {
    const updated = await Purchase.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("raffleId");

    if (!updated) {
      return res.status(404).json({ message: "Compra no encontrada" });
    }

    res.json({ message: "Estado actualizado", purchase: updated });
  } catch (error) {
    console.error("Error al actualizar estado:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});


export default router;
