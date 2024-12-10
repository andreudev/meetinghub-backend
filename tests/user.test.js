const request = require("supertest");
const server = "http://localhost:5000";

describe("Pruebas de autenticación de usuarios", () => {
  let token;

  test("Registro de usuario", async () => {
    const response = await request(server).post("/api/users/register").send({
      nombre: "Test User",
      correo: "testuser@example.com",
      contraseña: "123456",
      rol: "usuario",
    });

    expect(response.statusCode).toBe(201);
  });

  test("Login de usuario", async () => {
    const response = await request(server).post("/api/users/login").send({
      correo: "testuser@example.com",
      contraseña: "123456",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();
    token = response.body.token;
  });

  test("Obtener perfil con token válido", async () => {
    const response = await request(server)
      .get("/api/users/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
  });
});
