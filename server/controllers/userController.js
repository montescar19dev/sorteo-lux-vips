// /server/controllers/userController.js
import User from '../models/User.js';
import bcrypt from 'bcrypt';

export const createStaffUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Verifica si el usuario ya existe
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Ya existe un usuario con ese correo' });
    }

    // Encripta contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crea nuevo usuario staff
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: 'staff',
    });

    await newUser.save();

    res.status(201).json({ message: 'Empleado registrado con éxito' });
  } catch (error) {
    console.error('Error registrando empleado:', error);
    res.status(500).json({ message: 'Error al registrar empleado' });
  }
};
