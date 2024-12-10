const jwt = require("jsonwebtoken");

const protectRoute = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ mensaje: "No autorizado, token faltante" });
  }

  try {
    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ mensaje: "No autorizado, token inválido" });
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
