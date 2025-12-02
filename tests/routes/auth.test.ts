import { describe, it, expect, beforeEach, vi } from "vitest";
import request from "supertest";
import { createTestApp } from "../setup/test-app";
import { createTestUser } from "../setup/test-helpers";
import { testPrisma } from "../setup/test-setup";

const app = createTestApp();

describe("POST /auth/register", () => {
  it("deve criar um novo usuário com sucesso", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      })
      .expect(201);

    expect(response.body.message).toBe("Usuário criado");
    expect(response.body.user).toMatchObject({
      username: "testuser",
      email: "test@example.com",
    });
    expect(response.body.user.passwordHash).toBeUndefined();
  });

  it("deve retornar erro 400 quando faltam campos obrigatórios", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send({
        username: "testuser",
        // email e password faltando
      })
      .expect(400);

    expect(response.body.message).toBe("Faltam campos");
  });

  it("deve retornar erro 400 quando o usuário já existe (username)", async () => {
    await createTestUser({
      username: "existinguser",
      email: "existing@example.com",
      password: "password123",
    });

    const response = await request(app)
      .post("/auth/register")
      .send({
        username: "existinguser",
        email: "newemail@example.com",
        password: "password123",
      })
      .expect(400);

    expect(response.body.message).toBe("Usuário já existe");
  });

  it("deve retornar erro 400 quando o email já existe", async () => {
    await createTestUser({
      username: "existinguser",
      email: "existing@example.com",
      password: "password123",
    });

    const response = await request(app)
      .post("/auth/register")
      .send({
        username: "newuser",
        email: "existing@example.com",
        password: "password123",
      })
      .expect(400);

    expect(response.body.message).toBe("Usuário já existe");
  });
});

describe("POST /auth/login", () => {
  beforeEach(async () => {
    await createTestUser({
      username: "loginuser",
      email: "login@example.com",
      password: "password123",
    });
  });

  it("deve fazer login com sucesso usando username", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({
        username: "loginuser",
        password: "password123",
      })
      .expect(200);

    expect(response.body.message).toBe("Login bem-sucedido");
    expect(response.body.user).toMatchObject({
      username: "loginuser",
      email: "login@example.com",
    });
    expect(response.headers["set-cookie"]).toBeDefined();
  });

  it("deve retornar erro 401 com credenciais inválidas (senha errada)", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({
        username: "loginuser",
        password: "wrongpassword",
      })
      .expect(401);

    expect(response.body.message).toContain("Credenciais inválidas");
  });

  it("deve retornar erro 401 com usuário inexistente", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({
        username: "nonexistent",
        password: "password123",
      })
      .expect(401);

    expect(response.body.message).toContain("Credenciais inválidas");
  });
});

describe("GET /auth/me", () => {
  it("deve retornar erro 401 quando não autenticado", async () => {
    const response = await request(app)
      .get("/auth/me")
      .expect(401);

    expect(response.body.error).toBe("Não autenticado");
  });

  it("deve retornar informações do usuário autenticado", async () => {
    const user = await createTestUser({
      username: "meuser",
      email: "me@example.com",
      password: "password123",
    });

    // Primeiro fazer login para obter a sessão
    const loginResponse = await request(app)
      .post("/auth/login")
      .send({
        username: "meuser",
        password: "password123",
      })
      .expect(200);

    const cookies = loginResponse.headers["set-cookie"];

    // Agora fazer a requisição autenticada
    const response = await request(app)
      .get("/auth/me")
      .set("Cookie", cookies)
      .expect(200);

    expect(response.body.user).toMatchObject({
      id: user.id,
      username: "meuser",
      email: "me@example.com",
    });
  });
});

describe("POST /auth/logout", () => {
  it("deve fazer logout com sucesso", async () => {
    await createTestUser({
      username: "logoutuser",
      email: "logout@example.com",
      password: "password123",
    });

    // Fazer login primeiro
    const loginResponse = await request(app)
      .post("/auth/login")
      .send({
        username: "logoutuser",
        password: "password123",
      })
      .expect(200);

    const cookies = loginResponse.headers["set-cookie"];

    // Fazer logout
    const response = await request(app)
      .post("/auth/logout")
      .set("Cookie", cookies)
      .expect(200);

    expect(response.body.message).toBe("Logout realizado com sucesso");
  });
});
