const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  salaId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
  fecha: { type: Date, required: true },
});

module.exports = mongoose.model("Reservation", reservationSchema);
