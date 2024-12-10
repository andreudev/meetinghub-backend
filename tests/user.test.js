const request = require("supertest");
const server = "http://localhost:5000";

describe("Pruebas de autenticación de usuarios", () => {
  let token;

  // Limpieza de datos después de las pruebas (opcional si la base de datos lo requiere)
  afterAll(async () => {
    // Aquí puedes agregar código para limpiar la base de datos si es necesario
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

    expect(response.statusCode).toBe(400); // Dependiendo del comportamiento, puede ser 400 o 409
    expect(response.body.mensaje).toBe("El correo ya está registrado.");
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

  test("Obtener perfil con token no válido", async () => {
    const response = await request(server)
      .get("/api/users/profile")
      .set("Authorization", "Bearer invalidtoken");

    expect(response.statusCode).toBe(401);
    expect(response.body.mensaje).toBe("Token no válido");
  });
});
