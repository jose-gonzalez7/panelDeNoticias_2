const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const header = req.headers["authorization"];
  const token = header && header.split(" ")[1]; // Formato esperado: "Bearer token"

  if (!token) return res.status(403).json({ message: "Token requerido" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Token inválido o expirado" });

    req.user = decoded; // Aquí tienes { id, email, rol }
    next();
  });
}

function requireRole(role) {
  return (req, res, next) => {
    if (req.user.rol !== role) {
      return res.status(403).json({ message: "Acceso denegado: rol insuficiente" });
    }
    next();
  };
}

module.exports = { verifyToken, requireRole };