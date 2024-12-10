require("dotenv").config();
const connectDB = require("./config/db");
const app = require("./app");
const userRoutes = require("./routes/userRoutes");

connectDB();

//Configurar rutas
app.use("/api/users", userRoutes);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Servidor ejecutándose en el puerto http://localhost:${port}`);
});
