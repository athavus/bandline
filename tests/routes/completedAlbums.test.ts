import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { createTestApp } from "../setup/test-app";
import { createTestUser } from "../setup/test-helpers";
import { testPrisma } from "../setup/test-setup";

const app = createTestApp();

describe("POST /completedAlbums", () => {
  it("deve retornar erro 401 quando não autenticado", async () => {
    const response = await request(app)
      .post("/completedAlbums")
      .send({
        albumId: "album1",
        albumName: "Album 1",
      })
      .expect(401);

    expect(response.body.error).toBe("Não Autenticado");
  });

  it("deve marcar álbum como concluído com sucesso", async () => {
    const user = await createTestUser({
      username: "completed1",
      email: "completed1@example.com",
      password: "password123",
    });

    const loginResponse = await request(app)
      .post("/auth/login")
      .send({
        username: "completed1",
        password: "password123",
      })
      .expect(200);

    const cookies = loginResponse.headers["set-cookie"];

    const response = await request(app)
      .post("/completedAlbums")
      .set("Cookie", cookies)
      .send({
        albumId: "album123",
        albumName: "Album Teste",
        albumTracks: ["t1", "t2"],
      })
      .expect(200);

    expect(response.body.message).toBe(
      "Álbum marcado como concluído com sucesso",
    );
    expect(response.body.completedAlbum).toMatchObject({
      userId: user.id,
      albumId: "album123",
      albumName: "Album Teste",
    });
  });

  it("deve retornar erro 400 quando faltam campos obrigatórios", async () => {
    await createTestUser({
      username: "completed2",
      email: "completed2@example.com",
      password: "password123",
    });

    const loginResponse = await request(app)
      .post("/auth/login")
      .send({
        username: "completed2",
        password: "password123",
      })
      .expect(200);

    const cookies = loginResponse.headers["set-cookie"];

    const response = await request(app)
      .post("/completedAlbums")
      .set("Cookie", cookies)
      .send({
        albumId: "album-wo-name",
      })
      .expect(400);

    expect(response.body.error).toBe("albumId e albumName são obrigatórios");
  });

  it("deve retornar erro 409 quando álbum já está nos completos", async () => {
    const user = await createTestUser({
      username: "completed3",
      email: "completed3@example.com",
      password: "password123",
    });

    await testPrisma.completedAlbums.create({
      data: {
        userId: user.id,
        albumId: "dup_album",
        albumName: "Duplicado",
        albumTracks: "10",
      },
    });

    const loginResponse = await request(app)
      .post("/auth/login")
      .send({
        username: "completed3",
        password: "password123",
      })
      .expect(200);

    const cookies = loginResponse.headers["set-cookie"];

    const response = await request(app)
      .post("/completedAlbums")
      .set("Cookie", cookies)
      .send({
        albumId: "dup_album",
        albumName: "Duplicado",
      })
      .expect(409);

    expect(response.body.error).toBe("Álbum já está nos completos");
    expect(response.body.favorite).toBeDefined();
  });
});

describe("GET /completedAlbums", () => {
  it("deve retornar erro 401 quando não autenticado", async () => {
    const response = await request(app).get("/completedAlbums").expect(401);
    expect(response.body.error).toBe("Não Autenticado");
  });

  it("deve listar álbuns concluídos ordenados por data", async () => {
    const user = await createTestUser({
      username: "completed4",
      email: "completed4@example.com",
      password: "password123",
    });

    await testPrisma.completedAlbums.createMany({
      data: [
        { userId: user.id, albumId: "a1", albumName: "A1", albumTracks: "5" },
        { userId: user.id, albumId: "a2", albumName: "A2", albumTracks: "6" },
      ],
    });

    const loginResponse = await request(app)
      .post("/auth/login")
      .send({
        username: "completed4",
        password: "password123",
      })
      .expect(200);

    const cookies = loginResponse.headers["set-cookie"];

    const response = await request(app)
      .get("/completedAlbums")
      .set("Cookie", cookies)
      .expect(200);

    expect(response.body.completedAlbums).toBeInstanceOf(Array);
    expect(response.body.completedAlbums.length).toBeGreaterThanOrEqual(2);
    expect(response.body.completedAlbums[0].userId).toBe(user.id);
  });
});

describe("POST /completedAlbums/check", () => {
  it("deve retornar erro 401 quando não autenticado", async () => {
    const response = await request(app)
      .post("/completedAlbums/check")
      .send({ albumIds: ["a1"] })
      .expect(401);
    expect(response.body.error).toBe("Não Autenticado");
  });

  it("deve retornar IDs marcados como concluídos", async () => {
    const user = await createTestUser({
      username: "completed5",
      email: "completed5@example.com",
      password: "password123",
    });

    await testPrisma.completedAlbums.createMany({
      data: [
        { userId: user.id, albumId: "a1", albumName: "A1", albumTracks: "5" },
        { userId: user.id, albumId: "a2", albumName: "A2", albumTracks: "6" },
      ],
    });

    const loginResponse = await request(app)
      .post("/auth/login")
      .send({
        username: "completed5",
        password: "password123",
      })
      .expect(200);

    const cookies = loginResponse.headers["set-cookie"];

    const response = await request(app)
      .post("/completedAlbums/check")
      .set("Cookie", cookies)
      .send({ albumIds: ["a1", "a2", "a3"] })
      .expect(200);

    expect(response.body.completedIds).toContain("a1");
    expect(response.body.completedIds).toContain("a2");
    expect(response.body.completedIds).not.toContain("a3");
  });
});

describe("DELETE /completedAlbums", () => {
  it("deve retornar erro 401 quando não autenticado", async () => {
    const response = await request(app)
      .delete("/completedAlbums")
      .send({ albumId: "x" })
      .expect(401);
    expect(response.body.error).toBe("Não Autenticado");
  });

  it("deve desmarcar álbum concluído", async () => {
    const user = await createTestUser({
      username: "completed6",
      email: "completed6@example.com",
      password: "password123",
    });

    await testPrisma.completedAlbums.create({
      data: {
        userId: user.id,
        albumId: "del_album",
        albumName: "Deletar",
        albumTracks: "8",
      },
    });

    const loginResponse = await request(app)
      .post("/auth/login")
      .send({
        username: "completed6",
        password: "password123",
      })
      .expect(200);

    const cookies = loginResponse.headers["set-cookie"];

    const response = await request(app)
      .delete("/completedAlbums")
      .set("Cookie", cookies)
      .send({ albumId: "del_album" })
      .expect(200);

    expect(response.body.message).toBe(
      "Álbum desmarcado como concluído com sucesso",
    );
    expect(response.body.deleted.count).toBe(1);
  });

  it("deve retornar erro 400 quando albumId não é fornecido", async () => {
    await createTestUser({
      username: "completed7",
      email: "completed7@example.com",
      password: "password123",
    });

    const loginResponse = await request(app)
      .post("/auth/login")
      .send({
        username: "completed7",
        password: "password123",
      })
      .expect(200);

    const cookies = loginResponse.headers["set-cookie"];

    const response = await request(app)
      .delete("/completedAlbums")
      .set("Cookie", cookies)
      .send({})
      .expect(400);

    expect(response.body.error).toBe("albumId é obrigatório");
  });

  it("deve retornar erro 404 quando álbum não existe", async () => {
    await createTestUser({
      username: "completed8",
      email: "completed8@example.com",
      password: "password123",
    });

    const loginResponse = await request(app)
      .post("/auth/login")
      .send({
        username: "completed8",
        password: "password123",
      })
      .expect(200);

    const cookies = loginResponse.headers["set-cookie"];

    const response = await request(app)
      .delete("/completedAlbums")
      .set("Cookie", cookies)
      .send({ albumId: "nonexistent" })
      .expect(404);

    expect(response.body.error).toBe("Álbum não encontrado");
  });
});

