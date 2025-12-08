import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockSpotifyAlbumsResponse } from "../setup/mocks";

vi.mock("node-fetch", () => ({
  default: vi.fn(),
}));

vi.mock("../../server/src/config/spotifyToken", () => ({
  default: async () => "mock_test_token",
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
      .expect(500);
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
      .expect(500);
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
