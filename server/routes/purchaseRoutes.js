import express from 'express';
import Purchase from '../models/Purchase.js';
import { verifyToken } from '../middleware/auth.js'; // si usas autenticación

const router = express.Router();

// Ruta protegida para obtener todas las compras (solo admins)
router.get('/', verifyToken, async (req, res) => {
  try {
    const purchases = await Purchase.find().sort({ createdAt: -1 }).populate('userId raffleId');
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las compras' });
  }
});

export default router;
