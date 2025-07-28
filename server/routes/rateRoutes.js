// /server/routes/rateRoutes.js
import express from "express";

const router = express.Router();

// Cache simple en memoria (5 minutos)
let cachedRate = null;
let cachedAt = 0;
const CACHE_MS = 5 * 60 * 1000;

router.get("/usd-bcv", async (req, res) => {
  try {
    const now = Date.now();

    if (cachedRate && now - cachedAt < CACHE_MS) {
      return res.json({ success: true, rate: cachedRate });
    }

    const resp = await fetch("https://ve.dolarapi.com/v1/dolares/oficial");
    if (!resp.ok) {
      throw new Error("No se pudo obtener la tasa del BCV");
    }
    const data = await resp.json();
    // La API trae "promedio". Lo usaremos como tasa oficial.
    const rate = Number(data.promedio);

    if (Number.isNaN(rate)) {
      throw new Error("La tasa recibida no es válida");
    }

    cachedRate = rate;
    cachedAt = now;

    return res.json({ success: true, rate });
  } catch (err) {
    console.error("Error al obtener tasa BCV:", err);
    return res.status(500).json({ success: false, message: "Error al obtener tasa BCV" });
  }
});

export default router;
