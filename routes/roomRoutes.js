const express = require("express");
const Room = require("../models/Room");
const { protectRoute, adminRoute } = require("../middlewares/authMiddleware");

const router = express.Router();

// Crear una sala (Admin)
router.post("/", protectRoute, adminRoute, async (req, res) => {
  const { nombre, capacidad, ubicacion } = req.body;
  const room = new Room({ nombre, capacidad, ubicacion });
  const savedRoom = await room.save();
  res.status(201).json(savedRoom);
});

// Listar todas las salas
router.get("/", async (req, res) => {
  const rooms = await Room.find({});
  res.status(200).json(rooms);
});

// Editar una sala (Admin)
router.put("/:id", protectRoute, adminRoute, async (req, res) => {
  const { id } = req.params;
  const { nombre, capacidad, ubicacion } = req.body;
  const updatedRoom = await Room.findByIdAndUpdate(
    id,
    { nombre, capacidad, ubicacion },
    { new: true }
  );
  res.status(200).json(updatedRoom);
});

// Eliminar una sala (Admin)
router.delete("/:id", protectRoute, adminRoute, async (req, res) => {
  const { id } = req.params;

  try {
    const room = await Room.findByIdAndDelete(id);
    if (!room) {
      return res.status(404).json({ mensaje: "Sala no encontrada" });
    }
    res.status(200).json({ mensaje: "Sala eliminada" });
  } catch (error) {
    console.error("Error al eliminar sala:", error);
    res.status(500).json({ mensaje: "Error en el servidor." });
  }
});

module.exports = router;
