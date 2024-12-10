const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  rol: {
    type: String,
    enum: ["admin", "usuario"],
    required: true,
    default: "usuario",
  },
  contraseña: { type: String, required: true },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("contraseña")) return next();
  this.contraseña = await bcrypt.hash(this.contraseña, 10);
  next();
});

userSchema.methods.compararContraseña = async function (password) {
  return bcrypt.compare(password, this.contraseña);
};

module.exports = mongoose.model("User", userSchema);
