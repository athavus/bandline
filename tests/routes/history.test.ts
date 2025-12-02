import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { createTestApp } from "../setup/test-app";
import { createTestUser } from "../setup/test-helpers";
import { testPrisma } from "../setup/test-setup";

const app = createTestApp();

describe("POST /history", () => {
  it("deve retornar erro 401 quando não autenticado", async () => {
    const response = await request(app)
      .post("/history")
      .send({
        artistId: "test_id",
        artistName: "Test Artist",
        artistAvatar: "https://example.com/avatar.jpg",
      })
      .expect(401);

    expect(response.body.error).toBe("Não Autenticado");
  });

  it("deve criar entrada no histórico com sucesso", async () => {
    const user = await createTestUser({
      username: "historyuser",
      email: "history@example.com",
      password: "password123",
    });

    // Fazer login
    const loginResponse = await request(app)
      .post("/auth/login")
      .send({
        username: "historyuser",
        password: "password123",
      })
      .expect(200);

    const cookies = loginResponse.headers["set-cookie"];

    const historyData = {
      artistId: "4Z8W4fKeB5YxbusRsdQVPb",
      artistName: "Radiohead",
      artistAvatar: "https://i.scdn.co/image/ab67616d0000b273c5649add07ed3720be9d5526",
    };

    const response = await request(app)
      .post("/history")
      .set("Cookie", cookies)
      .send(historyData)
      .expect(200);

    expect(response.body.history).toMatchObject({
      userId: user.id,
      artistId: historyData.artistId,
      artistName: historyData.artistName,
      artistAvatar: historyData.artistAvatar,
    });
    expect(response.body.history.searchedAt).toBeDefined();
  });

  it("deve retornar erro 400 quando faltam campos obrigatórios", async () => {
    const user = await createTestUser({
      username: "historyuser2",
      email: "history2@example.com",
      password: "password123",
    });

    const loginResponse = await request(app)
      .post("/auth/login")
      .send({
        username: "historyuser2",
        password: "password123",
      })
      .expect(200);

    const cookies = loginResponse.headers["set-cookie"];

    const response = await request(app)
      .post("/history")
      .set("Cookie", cookies)
      .send({
        artistId: "test_id",
        // artistName e artistAvatar faltando
      })
      .expect(400);

    expect(response.body.error).toBe(
      "artistId, artistName e artistAvatar são obrigatórios",
    );
  });
});

describe("GET /history", () => {
  it("deve retornar erro 401 quando não autenticado", async () => {
    const response = await request(app).get("/history").expect(401);

    expect(response.body.error).toBe("Não Autenticado");
  });

  it("deve retornar histórico vazio quando o usuário não tem histórico", async () => {
    await createTestUser({
      username: "historyuser3",
      email: "history3@example.com",
      password: "password123",
    });

    const loginResponse = await request(app)
      .post("/auth/login")
      .send({
        username: "historyuser3",
        password: "password123",
      })
      .expect(200);

    const cookies = loginResponse.headers["set-cookie"];

    const response = await request(app)
      .get("/history")
      .set("Cookie", cookies)
      .expect(200);

    expect(response.body.histories).toEqual([]);
  });

  it("deve retornar histórico do usuário ordenado por data (mais recente primeiro)", async () => {
    const user = await createTestUser({
      username: "historyuser4",
      email: "history4@example.com",
      password: "password123",
    });

    // Criar algumas entradas de histórico diretamente
    await testPrisma.history.createMany({
      data: [
        {
          userId: user.id,
          artistId: "artist1",
          artistName: "Artist 1",
          artistAvatar: "https://example.com/avatar1.jpg",
        },
        {
          userId: user.id,
          artistId: "artist2",
          artistName: "Artist 2",
          artistAvatar: "https://example.com/avatar2.jpg",
        },
      ],
    });

    const loginResponse = await request(app)
      .post("/auth/login")
      .send({
        username: "historyuser4",
        password: "password123",
      })
      .expect(200);

    const cookies = loginResponse.headers["set-cookie"];

    const response = await request(app)
      .get("/history")
      .set("Cookie", cookies)
      .expect(200);

    expect(response.body.histories).toBeInstanceOf(Array);
    expect(response.body.histories.length).toBe(2);
    expect(response.body.histories[0].userId).toBe(user.id);

    // Verificar que está ordenado por data (mais recente primeiro)
    if (response.body.histories.length >= 2) {
      const date1 = new Date(response.body.histories[0].searchedAt);
      const date2 = new Date(response.body.histories[1].searchedAt);
      expect(date1.getTime()).toBeGreaterThanOrEqual(date2.getTime());
    }
  });

  it("deve limitar histórico a 50 entradas", async () => {
    const user = await createTestUser({
      username: "historyuser5",
      email: "history5@example.com",
      password: "password123",
    });

    // Criar mais de 50 entradas
    const historyEntries = Array.from({ length: 55 }, (_, i) => ({
      userId: user.id,
      artistId: `artist${i}`,
      artistName: `Artist ${i}`,
      artistAvatar: `https://example.com/avatar${i}.jpg`,
    }));

    await testPrisma.history.createMany({
      data: historyEntries,
    });

    const loginResponse = await request(app)
      .post("/auth/login")
      .send({
        username: "historyuser5",
        password: "password123",
      })
      .expect(200);

    const cookies = loginResponse.headers["set-cookie"];

    const response = await request(app)
      .get("/history")
      .set("Cookie", cookies)
      .expect(200);

    expect(response.body.histories.length).toBeLessThanOrEqual(50);
  });
});
