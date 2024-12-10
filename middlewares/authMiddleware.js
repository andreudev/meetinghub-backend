const jwt = require("jsonwebtoken");

const protectRoute = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ mensaje: "No autorizado, token faltante o formato incorrecto" });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Agregar usuario decodificado a la solicitud
    next();
  } catch (error) {
    console.error("Error al verificar el token:", error);
    res.status(401).json({ mensaje: "Token no válido" });
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
