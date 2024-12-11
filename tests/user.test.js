const request = require("supertest");
const jwt = require("jsonwebtoken"); // Asegúrate de tener instalado jsonwebtoken
const server = "http://localhost:5000"; // Cambia la URL si tu servidor está en otro puerto
require("dotenv").config();

describe("Pruebas de autenticación de usuarios", () => {
  let token;

  beforeAll(() => {
    token = null; // Inicializamos el token
  });

  // Limpieza de datos después de las pruebas
  afterAll(async () => {
    try {
      const response = await request(server)
        .delete("/api/users/testuser@example.com")
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.mensaje).toBe("Usuario eliminado");
    } catch (error) {
      console.error("Error al eliminar el usuario:", error.message);
    }
  });

  test("Registro de usuario", async () => {
    const response = await request(server).post("/api/users/register").send({
      nombre: "Test User",
      correo: "testuser@example.com",
      contraseña: "123456",
      rol: "usuario",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("_id");
    expect(response.body.correo).toBe("testuser@example.com");
  });

  test("Intentar registrar un usuario con el mismo correo (error)", async () => {
    const response = await request(server).post("/api/users/register").send({
      nombre: "Test User 2",
      correo: "testuser@example.com", // Correo duplicado
      contraseña: "654321",
      rol: "usuario",
    });

    expect(response.statusCode).toBe(400); // O el código que uses para conflictos
    expect(response.body.mensaje).toBe("El correo ya está registrado.");
  });

  test("Login de usuario", async () => {
    const response = await request(server).post("/api/users/login").send({
      correo: "testuser@example.com",
      contraseña: "123456",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();
    token = response.body.token; // Guardamos el token
  });

  test("Intentar login con credenciales incorrectas", async () => {
    const response = await request(server).post("/api/users/login").send({
      correo: "testuser@example.com",
      contraseña: "wrongpassword", // Contraseña incorrecta
    });

    expect(response.statusCode).toBe(401);
    expect(response.body.mensaje).toBe("Correo o contraseña incorrectos");
  });

  test("Obtener perfil con token válido", async () => {
    const response = await request(server)
      .get("/api/users/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.correo).toBe("testuser@example.com");
  });

  test("Obtener perfil sin token", async () => {
    const response = await request(server).get("/api/users/profile");

    expect(response.statusCode).toBe(401);
    expect(response.body.mensaje).toBe(
      "No autorizado, token faltante o incorrecto"
    );
  });

  test("Obtener perfil con token no válido", async () => {
    const response = await request(server)
      .get("/api/users/profile")
      .set("Authorization", "Bearer invalidtoken");

    expect(response.statusCode).toBe(401);
    expect(response.body.mensaje).toBe("Token no válido o expirado");
  });

  test("Intentar obtener perfil con token expirado", async () => {
    const expiredToken = jwt.sign(
      { id: "testuser_id" },
      process.env.JWT_SECRET,
      { expiresIn: "1ms" } // Token que expira inmediatamente
    );

    const response = await request(server)
      .get("/api/users/profile")
      .set("Authorization", `Bearer ${expiredToken}`);

    expect(response.statusCode).toBe(401);
    expect(response.body.mensaje).toBe("Token no válido o expirado");
  });
});
