import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1]; // Bearer TOKEN

  console.log("→ HEADER:", authHeader);
  console.log("→ TOKEN:", token);

  if (!token) {
    console.log("⛔ Token no proporcionado");
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("✅ TOKEN VÁLIDO:", decoded);
    next();
  } catch (error) {
    console.log("⛔ TOKEN INVÁLIDO:", error.message);
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};
