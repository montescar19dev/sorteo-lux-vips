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

export default router;
