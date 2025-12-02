import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { createTestApp } from "../setup/test-app";
import { createTestUser } from "../setup/test-helpers";
import { testPrisma } from "../setup/test-setup";

const app = createTestApp();

describe("POST /favorites", () => {
  it("deve retornar erro 401 quando não autenticado", async () => {
    const response = await request(app)
      .post("/favorites")
      .send({
        albumId: "album1",
        albumName: "Album 1",
      })
      .expect(401);

    expect(response.body.error).toBe("Não Autenticado");
  });

  it("deve adicionar favorito com sucesso", async () => {
    const user = await createTestUser({
      username: "favoritesuser",
      email: "favorites@example.com",
      password: "password123",
    });

    const loginResponse = await request(app)
      .post("/auth/login")
      .send({
        username: "favoritesuser",
        password: "password123",
      })
      .expect(200);

    const cookies = loginResponse.headers["set-cookie"];

    const favoriteData = {
      albumId: "1To7kv722A8SpZF7M07D4p",
      albumName: "OK Computer",
      albumImage: "https://i.scdn.co/image/ab67616d0000b273c5649add07ed3720be9d5526",
      albumTracks: ["track1", "track2", "track3"],
    };

    const response = await request(app)
      .post("/favorites")
      .set("Cookie", cookies)
      .send(favoriteData)
      .expect(200);

    expect(response.body.favorite).toMatchObject({
      userId: user.id,
      albumId: favoriteData.albumId,
      albumName: favoriteData.albumName,
      albumImage: favoriteData.albumImage,
    });
    expect(response.body.message).toBe("Álbum favoritado com sucesso");
  });

  it("deve retornar erro 400 quando faltam campos obrigatórios", async () => {
    const user = await createTestUser({
      username: "favoritesuser2",
      email: "favorites2@example.com",
      password: "password123",
    });

    const loginResponse = await request(app)
      .post("/auth/login")
      .send({
        username: "favoritesuser2",
        password: "password123",
      })
      .expect(200);

    const cookies = loginResponse.headers["set-cookie"];

    const response = await request(app)
      .post("/favorites")
      .set("Cookie", cookies)
      .send({
        albumId: "album1",
        // albumName faltando
      })
      .expect(400);

    expect(response.body.error).toBe("albumId e albumName são obrigatórios");
  });

  it("deve retornar erro 409 quando álbum já está nos favoritos", async () => {
    const user = await createTestUser({
      username: "favoritesuser3",
      email: "favorites3@example.com",
      password: "password123",
    });

    // Criar favorito diretamente
    await testPrisma.favorites.create({
      data: {
        userId: user.id,
        albumId: "existing_album",
        albumName: "Existing Album",
        albumTracks: "10",
      },
    });

    const loginResponse = await request(app)
      .post("/auth/login")
      .send({
        username: "favoritesuser3",
        password: "password123",
      })
      .expect(200);

    const cookies = loginResponse.headers["set-cookie"];

    const response = await request(app)
      .post("/favorites")
      .set("Cookie", cookies)
      .send({
        albumId: "existing_album",
        albumName: "Existing Album",
      })
      .expect(409);

    expect(response.body.error).toBe("Álbum já está nos favoritos");
    expect(response.body.favorite).toBeDefined();
  });
});

describe("GET /favorites", () => {
  it("deve retornar erro 401 quando não autenticado", async () => {
    const response = await request(app).get("/favorites").expect(401);

    expect(response.body.error).toBe("Não Autenticado");
  });

  it("deve retornar lista vazia quando usuário não tem favoritos", async () => {
    await createTestUser({
      username: "favoritesuser4",
      email: "favorites4@example.com",
      password: "password123",
    });

    const loginResponse = await request(app)
      .post("/auth/login")
      .send({
        username: "favoritesuser4",
        password: "password123",
      })
      .expect(200);

    const cookies = loginResponse.headers["set-cookie"];

    const response = await request(app)
      .get("/favorites")
      .set("Cookie", cookies)
      .expect(200);

    expect(response.body.favorites).toEqual([]);
  });

  it("deve retornar favoritos do usuário ordenados por data", async () => {
    const user = await createTestUser({
      username: "favoritesuser5",
      email: "favorites5@example.com",
      password: "password123",
    });

    // Criar favoritos diretamente
    await testPrisma.favorites.createMany({
      data: [
        {
          userId: user.id,
          albumId: "album1",
          albumName: "Album 1",
          albumTracks: "10",
        },
        {
          userId: user.id,
          albumId: "album2",
          albumName: "Album 2",
          albumTracks: "12",
        },
      ],
    });

    const loginResponse = await request(app)
      .post("/auth/login")
      .send({
        username: "favoritesuser5",
        password: "password123",
      })
      .expect(200);

    const cookies = loginResponse.headers["set-cookie"];

    const response = await request(app)
      .get("/favorites")
      .set("Cookie", cookies)
      .expect(200);

    expect(response.body.favorites).toBeInstanceOf(Array);
    expect(response.body.favorites.length).toBe(2);
    expect(response.body.favorites[0].userId).toBe(user.id);
  });
});

describe("DELETE /favorites", () => {
  it("deve retornar erro 401 quando não autenticado", async () => {
    const response = await request(app)
      .delete("/favorites")
      .send({
        albumId: "album1",
      })
      .expect(401);

    expect(response.body.error).toBe("Não Autenticado");
  });

  it("deve remover favorito com sucesso", async () => {
    const user = await createTestUser({
      username: "favoritesuser6",
      email: "favorites6@example.com",
      password: "password123",
    });

    // Criar favorito
    await testPrisma.favorites.create({
      data: {
        userId: user.id,
        albumId: "album_to_delete",
        albumName: "Album to Delete",
        albumTracks: "10",
      },
    });

    const loginResponse = await request(app)
      .post("/auth/login")
      .send({
        username: "favoritesuser6",
        password: "password123",
      })
      .expect(200);

    const cookies = loginResponse.headers["set-cookie"];

    const response = await request(app)
      .delete("/favorites")
      .set("Cookie", cookies)
      .send({
        albumId: "album_to_delete",
      })
      .expect(200);

    expect(response.body.message).toBe("Favorito removido com sucesso");
    expect(response.body.deleted.count).toBe(1);
  });

  it("deve retornar erro 400 quando albumId não é fornecido", async () => {
    await createTestUser({
      username: "favoritesuser7",
      email: "favorites7@example.com",
      password: "password123",
    });

    const loginResponse = await request(app)
      .post("/auth/login")
      .send({
        username: "favoritesuser7",
        password: "password123",
      })
      .expect(200);

    const cookies = loginResponse.headers["set-cookie"];

    const response = await request(app)
      .delete("/favorites")
      .set("Cookie", cookies)
      .send({})
      .expect(400);

    expect(response.body.error).toBe("albumId é obrigatório");
  });

  it("deve retornar erro 404 quando favorito não existe", async () => {
    await createTestUser({
      username: "favoritesuser8",
      email: "favorites8@example.com",
      password: "password123",
    });

    const loginResponse = await request(app)
      .post("/auth/login")
      .send({
        username: "favoritesuser8",
        password: "password123",
      })
      .expect(200);

    const cookies = loginResponse.headers["set-cookie"];

    const response = await request(app)
      .delete("/favorites")
      .set("Cookie", cookies)
      .send({
        albumId: "nonexistent_album",
      })
      .expect(404);

    expect(response.body.error).toBe("Favorito não encontrado");
  });
});

describe("POST /favorites/check", () => {
  it("deve retornar erro 401 quando não autenticado", async () => {
    const response = await request(app)
      .post("/favorites/check")
      .send({
        albumIds: ["album1", "album2"],
      })
      .expect(401);

    expect(response.body.error).toBe("Não Autenticado");
  });

  it("deve retornar lista de IDs favoritados", async () => {
    const user = await createTestUser({
      username: "favoritesuser9",
      email: "favorites9@example.com",
      password: "password123",
    });

    // Criar favoritos
    await testPrisma.favorites.createMany({
      data: [
        {
          userId: user.id,
          albumId: "album1",
          albumName: "Album 1",
          albumTracks: "10",
        },
        {
          userId: user.id,
          albumId: "album2",
          albumName: "Album 2",
          albumTracks: "12",
        },
      ],
    });

    const loginResponse = await request(app)
      .post("/auth/login")
      .send({
        username: "favoritesuser9",
        password: "password123",
      })
      .expect(200);

    const cookies = loginResponse.headers["set-cookie"];

    const response = await request(app)
      .post("/favorites/check")
      .set("Cookie", cookies)
      .send({
        albumIds: ["album1", "album2", "album3"],
      })
      .expect(200);

    expect(response.body.favoriteIds).toBeInstanceOf(Array);
    expect(response.body.favoriteIds).toContain("album1");
    expect(response.body.favoriteIds).toContain("album2");
    expect(response.body.favoriteIds).not.toContain("album3");
  });

  it("deve retornar erro 400 quando albumIds não é um array", async () => {
    await createTestUser({
      username: "favoritesuser10",
      email: "favorites10@example.com",
      password: "password123",
    });

    const loginResponse = await request(app)
      .post("/auth/login")
      .send({
        username: "favoritesuser10",
        password: "password123",
      })
      .expect(200);

    const cookies = loginResponse.headers["set-cookie"];

    const response = await request(app)
      .post("/favorites/check")
      .set("Cookie", cookies)
      .send({
        albumIds: "not_an_array",
      })
      .expect(400);

    expect(response.body.error).toBe("albumIds é obrigatório e deve ser um array");
  });
});
