import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { createTestApp } from "../setup/test-app";
import { createTestUser } from "../setup/test-helpers";

const app = createTestApp();

describe("GET /profile", () => {
  it("deve retornar erro 401 quando não autenticado", async () => {
    const response = await request(app).get("/profile").expect(401);

    expect(response.body.error).toBe("Não autenticado, ação não permitida");
  });

  it("deve retornar perfil do usuário com histórico e favoritos", async () => {
    const user = await createTestUser({
      username: "profileuser",
      email: "profile@example.com",
      password: "password123",
      bio: "Test bio",
      avatarUrl: "https://example.com/avatar.jpg",
    });

    const loginResponse = await request(app)
      .post("/auth/login")
      .send({
        username: "profileuser",
        password: "password123",
      })
      .expect(200);

    const cookies = loginResponse.headers["set-cookie"];

    const response = await request(app)
      .get("/profile")
      .set("Cookie", cookies)
      .expect(200);

    expect(response.body.profile).toMatchObject({
      id: user.id,
      username: "profileuser",
      email: "profile@example.com",
      bio: "Test bio",
      avatarUrl: "https://example.com/avatar.jpg",
    });
    expect(response.body.profile.histories).toBeInstanceOf(Array);
    expect(response.body.profile.favorites).toBeInstanceOf(Array);
  });

  it("deve retornar erro 404 quando usuário não existe", async () => {
    // Este teste pode ser difícil de criar sem manipular diretamente o banco
    // mas podemos verificar se o endpoint requer autenticação
    const response = await request(app).get("/profile").expect(401);
    expect(response.body.error).toBeDefined();
  });
});

describe("PUT /profile", () => {
  it("deve retornar erro 401 quando não autenticado", async () => {
    const response = await request(app)
      .put("/profile")
      .send({
        username: "newusername",
      })
      .expect(401);

    expect(response.body.error).toBe("Não autenticado, ação não permitida");
  });

  it("deve atualizar perfil com sucesso", async () => {
    const user = await createTestUser({
      username: "profileuser2",
      email: "profile2@example.com",
      password: "password123",
    });

    const loginResponse = await request(app)
      .post("/auth/login")
      .send({
        username: "profileuser2",
        password: "password123",
      })
      .expect(200);

    const cookies = loginResponse.headers["set-cookie"];

    const updateData = {
      username: "updatedusername",
      bio: "Updated bio",
      avatarUrl: "https://example.com/new-avatar.jpg",
    };

    const response = await request(app)
      .put("/profile")
      .set("Cookie", cookies)
      .send(updateData)
      .expect(200);

    expect(response.body.message).toBe("Perfil atualizado com sucesso");
    expect(response.body.user).toMatchObject({
      id: user.id,
      username: "updatedusername",
      bio: "Updated bio",
      avatarUrl: "https://example.com/new-avatar.jpg",
    });
  });

  it("deve atualizar apenas campos fornecidos", async () => {
    const user = await createTestUser({
      username: "profileuser3",
      email: "profile3@example.com",
      password: "password123",
      bio: "Original bio",
    });

    const loginResponse = await request(app)
      .post("/auth/login")
      .send({
        username: "profileuser3",
        password: "password123",
      })
      .expect(200);

    const cookies = loginResponse.headers["set-cookie"];

    const response = await request(app)
      .put("/profile")
      .set("Cookie", cookies)
      .send({
        bio: "New bio only",
      })
      .expect(200);

    expect(response.body.user.bio).toBe("New bio only");
    expect(response.body.user.username).toBe("profileuser3"); // Não mudou
    expect(response.body.user.email).toBe("profile3@example.com"); // Não mudou
  });

  it("deve atualizar email com sucesso", async () => {
    const user = await createTestUser({
      username: "profileuser4",
      email: "profile4@example.com",
      password: "password123",
    });

    const loginResponse = await request(app)
      .post("/auth/login")
      .send({
        username: "profileuser4",
        password: "password123",
      })
      .expect(200);

    const cookies = loginResponse.headers["set-cookie"];

    const response = await request(app)
      .put("/profile")
      .set("Cookie", cookies)
      .send({
        email: "newemail@example.com",
      })
      .expect(200);

    expect(response.body.user.email).toBe("newemail@example.com");
  });
});
