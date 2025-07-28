import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Suponiendo que los administradores están en este modelo


const router = express.Router();

// Ruta para login de administradores
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await User.findOne({ email, role: { $in: ['admin', 'super_admin'] } });

    if (!admin) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        role: admin.role,
        name: admin.name
      }
    });
  } catch (error) {
    console.error('Error de login admin:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

router.put('/change-password', async (req, res) => {
  const { email, secret, newPassword } = req.body;

  // Secreto único definido por ti
  const ADMIN_SECRET = '$2b$12$7tL.Oh5yNewnTHEXw1buH.IcVZV0OvOD.zr0dplcw87Br/1mS0obK'; // hash de $4c3s0P3rm4n3nt3!2024#

  try {
    // Verifica que el secreto sea correcto
    const isSecretValid = await bcrypt.compare(secret, ADMIN_SECRET);
    if (!isSecretValid) {
      return res.status(403).json({ message: 'Contraseña secreta inválida' });
    }

    // Busca el admin por email
    const admin = await User.findOne({ email, role: { $in: ['admin', 'super_admin'] } });
    if (!admin) {
      return res.status(404).json({ message: 'Administrador no encontrado' });
    }

    // Encripta nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    admin.password = hashedPassword;

    await admin.save();

    res.json({ message: 'Contraseña actualizada con éxito' });
  } catch (error) {
    console.error('Error al cambiar la contraseña:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

export default router;
