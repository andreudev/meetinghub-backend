const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  capacidad: { type: Number, required: true },
  estado: {
    type: String,
    enum: ["disponible", "ocupada"],
    default: "disponible",
  },
});

module.exports = mongoose.model("Room", roomSchema);
