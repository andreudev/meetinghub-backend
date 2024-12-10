const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Registro
router.post("/register", async (req, res) => {
  const { nombre, correo, contraseña, rol } = req.body;
  const user = new User({ nombre, correo, contraseña, rol });
  const savedUser = await user.save();
  res.status(201).json(savedUser);
});

// Login
router.post("/login", async (req, res) => {
  const { correo, contraseña } = req.body;
  const user = await User.findOne({ correo });
  if (user && (await user.compararContraseña(contraseña))) {
    const token = jwt.sign(
      { id: user._id, rol: user.rol },
      process.env.JWT_SECRET
    );
    res.status(200).json({ token });
  } else {
    res.status(401).json({ mensaje: "Correo o contraseña incorrectos" });
  }
});

// Perfil protegido
router.get("/profile", async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json(user);
});

module.exports = router;
