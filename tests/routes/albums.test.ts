import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockSpotifyAlbumsResponse } from "../setup/mocks";

vi.mock("node-fetch", () => ({
  default: vi.fn(),
}));

vi.mock("../../server/src/config/spotifyToken", () => ({
  default: async () => ({
    access_token: "mock_test_token",
    token_type: "Bearer",
    expires_in: 3600,
  }),
}));

import fetch from "node-fetch";
import request from "supertest";
import { createTestApp } from "../setup/test-app";

const app = createTestApp();

describe("GET /artistAlbums/:id", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve retornar álbuns do artista ordenados por data", async () => {
    const artistId = "4Z8W4fKeB5YxbusRsdQVPb";

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockSpotifyAlbumsResponse,
    });

    const response = await request(app)
      .get(`/artistAlbums/${artistId}`)
      .expect(200);

    expect(response.body).toHaveProperty("total_amount");
    expect(response.body).toHaveProperty("items");
    expect(response.body.items).toBeInstanceOf(Array);

    if (response.body.items.length > 0) {
      expect(response.body.items[0]).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        release_date: expect.any(String),
        total_tracks: expect.any(Number),
      });
    }
  });

  it("deve ordenar álbuns por data de lançamento", async () => {
    const artistId = "4Z8W4fKeB5YxbusRsdQVPb";

    const mockAlbums = {
      total: 2,
      items: [
        {
          id: "album2",
          name: "Álbum 2",
          release_date: "2000-01-01",
          total_tracks: 10,
          href: "https://api.spotify.com/v1/albums/album2",
          images: [],
          artists: [],
        },
        {
          id: "album1",
          name: "Álbum 1",
          release_date: "1997-05-21",
          total_tracks: 12,
          href: "https://api.spotify.com/v1/albums/album1",
          images: [],
          artists: [],
        },
      ],
    };

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockAlbums,
    });

    const response = await request(app)
      .get(`/artistAlbums/${artistId}`)
      .expect(200);

    const items = response.body.items;

    // Verificação de ordenação
    if (items.length >= 2) {
      const date1 = new Date(items[0].release_date);
      const date2 = new Date(items[1].release_date);

      // O teste original verificava se o primeiro é menor que o segundo (crescente ou decrescente?)
      // Se sua API ordena do mais recente para o mais antigo (descrescente),
      // a data1 (índice 0) deveria ser MAIOR ou IGUAL a data2.
      // Se a API ordena do mais antigo para o novo (crescente),
      // a data1 deveria ser MENOR ou IGUAL a data2.
      // Mantive sua lógica original:
      expect(date1.getTime()).toBeLessThanOrEqual(date2.getTime());
    }
  });

  it("deve retornar erro 500 quando há erro na API do Spotify", async () => {
    const artistId = "invalid_id";

    (fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ error: "Not found" }),
    });

    const response = await request(app)
      .get(`/artistAlbums/${artistId}`)
      .expect(500);

    expect(response.body.error).toBeDefined();
  });
});
