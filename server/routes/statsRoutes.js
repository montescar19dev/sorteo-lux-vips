import express from "express";
import Raffle from "../models/Raffle.js";
import Purchase from "../models/Purchase.js";
import { verifyToken } from "../middleware/auth.js"; // solo si quieres protección

const router = express.Router();

router.get("/summary", verifyToken, async (req, res) => {
  try {
    const totalRaffles = await Raffle.countDocuments();

    const verifiedPurchases = await Purchase.find({ status: "verified" });

    const totalTickets = verifiedPurchases.reduce(
      (acc, curr) => acc + curr.ticketCount,
      0
    );

    const totalRevenue = verifiedPurchases.reduce(
      (acc, curr) => acc + curr.amount,
      0
    );

    res.json({
      totalRaffles, // ← aquí el cambio
      totalTickets,
      totalRevenue,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});


export default router;
