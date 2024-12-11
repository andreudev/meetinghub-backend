const express = require("express");
const Reservation = require("../models/Reservation");
const { protectRoute } = require("../middlewares/authMiddleware");

const router = express.Router();

// Crear una reserva
router.post("/", protectRoute, async (req, res) => {
  const { salaId, fecha_inicio, fecha_fin } = req.body;

  // Verificar solapamientos
  const overlappingReservations = await Reservation.find({
    salaId,
    $or: [
      { fecha_inicio: { $lt: fecha_fin, $gte: fecha_inicio } },
      { fecha_fin: { $gt: fecha_inicio, $lte: fecha_fin } },
      { fecha_inicio: { $lte: fecha_inicio }, fecha_fin: { $gte: fecha_fin } },
    ],
  });

  if (overlappingReservations.length > 0) {
    return res
      .status(400)
      .json({ mensaje: "La sala ya está reservada en ese horario." });
  }

  const reservation = new Reservation({
    usuarioId: req.user.id,
    salaId,
    fecha_inicio,
    fecha_fin,
  });
  const savedReservation = await reservation.save();

  // Poblar los datos de la sala en la reserva
  const populatedReservation = await Reservation.findById(
    savedReservation._id
  ).populate("salaId");

  res.status(201).json(populatedReservation);
});

// Listar las reservas del usuario
router.get("/", protectRoute, async (req, res) => {
  const reservations = await Reservation.find({
    usuarioId: req.user.id,
  }).populate("salaId");
  res.status(200).json(reservations);
});

// Editar una reserva
router.put("/:id", protectRoute, async (req, res) => {
  const { id } = req.params;
  const { fecha_inicio, fecha_fin } = req.body;

  // Verificar solapamientos
  const overlappingReservations = await Reservation.find({
    _id: { $ne: id },
    salaId: req.body.salaId,
    $or: [
      { fecha_inicio: { $lt: fecha_fin, $gte: fecha_inicio } },
      { fecha_fin: { $gt: fecha_inicio, $lte: fecha_fin } },
      { fecha_inicio: { $lte: fecha_inicio }, fecha_fin: { $gte: fecha_fin } },
    ],
  });

  if (overlappingReservations.length > 0) {
    return res
      .status(400)
      .json({ mensaje: "La sala ya está reservada en ese horario." });
  }

  const updatedReservation = await Reservation.findByIdAndUpdate(
    id,
    { fecha_inicio, fecha_fin },
    { new: true }
  ).populate("salaId");
  res.status(200).json(updatedReservation);
});

// Eliminar una reserva
router.delete("/:id", protectRoute, async (req, res) => {
  const { id } = req.params;
  await Reservation.findByIdAndDelete(id);
  res.status(200).json({ mensaje: "Reserva eliminada" });
});

module.exports = router;
