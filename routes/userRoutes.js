const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { protectRoute, adminRoute } = require("../middlewares/authMiddleware");

const router = express.Router();

// Registro
router.post("/register", async (req, res) => {
  const { nombre, correo, contraseña, rol } = req.body;

  try {
    const existingUser = await User.findOne({ correo });
    if (existingUser) {
      return res.status(400).json({ mensaje: "El correo ya está registrado." });
    }

    const user = new User({ nombre, correo, contraseña, rol });
    const savedUser = await user.save();

    res.status(201).json(savedUser.toJSON());
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ mensaje: "Error en el servidor." });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { correo, contraseña } = req.body;

  try {
    const user = await User.findOne({ correo });
    if (user && (await user.compararContraseña(contraseña))) {
      const token = jwt.sign(
        { id: user._id, rol: user.rol },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.status(200).json({ mensaje: "Login exitoso", token, rol: user.rol });
    } else {
      res.status(401).json({ mensaje: "Correo o contraseña incorrectos" });
    }
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ mensaje: "Error en el servidor." });
  }
});

// Listar todos los usuarios (Admin)
router.get("/", protectRoute, adminRoute, async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ mensaje: "Error en el servidor." });
  }
});

// Perfil protegido
router.get("/profile", protectRoute, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    res.status(500).json({ mensaje: "Error en el servidor." });
  }
});

module.exports = router;
