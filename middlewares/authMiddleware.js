const jwt = require("jsonwebtoken");

const protectRoute = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ mensaje: "No autorizado, token faltante o incorrecto" });
  }

  const token = authHeader.split(" ")[1]; // Extraer el token después de "Bearer"

  // Verificar el token
  try {
    // Decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    // Si el token no es válido, devolver un error
    console.error("Error al verificar el token:", error.message);
    res.status(401).json({ mensaje: "Token no válido o expirado" });
  }
};

const adminRoute = (req, res, next) => {
  if (req.user && req.user.rol === "admin") {
    next();
  } else {
    res.status(403).json({
      mensaje: "Acceso denegado, se requieren privilegios de administrador",
    });
  }
};

module.exports = { protectRoute, adminRoute };
