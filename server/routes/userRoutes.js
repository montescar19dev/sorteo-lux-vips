{/*}
// /server/routes/userRoutes.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { createStaffUser } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';


const router = express.Router();

// Ruta para crear empleados (solo accesible para admin o super_admin)
router.post('/create-staff', authenticateToken, authorizeRoles('admin', 'super_admin'), createStaffUser);

// Ruta para login de empleados (solo role: "staff")
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const staff = await User.findOne({ email, role: 'staff' });

    if (!staff) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: staff._id, email: staff.email, role: staff.role },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({
      token,
      user: {
        id: staff._id,
        email: staff.email,
        role: staff.role,
        name: staff.name
      }
    });
  } catch (error) {
    console.error('Error de login staff:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

export default router;

*/}