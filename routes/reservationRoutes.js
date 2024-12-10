const express = require("express");
const Reservation = require("../models/Reservation");
const { protectRoute } = require("../middlewares/authMiddleware");

const router = express.Router();

// Crear una reserva
router.post("/", protectRoute, async (req, res) => {
  const { salaId, fecha } = req.body;
  const reservation = new Reservation({
    usuarioId: req.user.id,
    salaId,
    fecha,
  });
  const savedReservation = await reservation.save();
  res.status(201).json(savedReservation);
});

// Listar las reservas del usuario
router.get("/", protectRoute, async (req, res) => {
  const reservations = await Reservation.find({ usuarioId: req.user.id });
  res.status(200).json(reservations);
});

// Eliminar una reserva
router.delete("/:id", protectRoute, async (req, res) => {
  const { id } = req.params;
  await Reservation.findByIdAndDelete(id);
  res.status(200).json({ mensaje: "Reserva eliminada" });
});

module.exports = router;
