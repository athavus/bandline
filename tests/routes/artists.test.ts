import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { createTestApp } from "../setup/test-app";
import {
  mockSpotifyArtistResponse,
  mockLastFmArtistInfoResponse,
  mockLastFmSimilarArtistsResponse,
  mockSpotifyToken,
} from "../setup/mocks";
import fetch from "node-fetch";

// Mock do fetch
vi.mock("node-fetch", () => ({
  default: vi.fn(),
}));

// Mock do getSpotifyToken
vi.mock("../../server/src/config/spotifyToken", () => ({
  default: async () => mockSpotifyToken,
}));

const app = createTestApp();

describe("GET /artists/:id", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve retornar detalhes do artista com sucesso", async () => {
    const artistId = "4Z8W4fKeB5YxbusRsdQVPb";

    // Mock das chamadas externas
    (fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockSpotifyArtistResponse,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockLastFmArtistInfoResponse,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockLastFmSimilarArtistsResponse,
      });

    const response = await request(app)
      .get(`/artists/${artistId}`)
      .expect(200);

    expect(response.body).toMatchObject({
      id: artistId,
      name: "Radiohead",
      total_followers: 8500000,
      popularity: 85,
      genres: ["alternative rock", "art rock", "britpop"],
    });
    expect(response.body.description).toBeDefined();
    expect(response.body.relatedArtists).toBeInstanceOf(Array);
  });

  it("deve aceitar parâmetro de idioma (lang)", async () => {
    const artistId = "4Z8W4fKeB5YxbusRsdQVPb";

    (fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockSpotifyArtistResponse,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockLastFmArtistInfoResponse,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockLastFmSimilarArtistsResponse,
      });

    const response = await request(app)
      .get(`/artists/${artistId}?lang=pt`)
      .expect(200);

    expect(response.body).toHaveProperty("id", artistId);
  });

  it("deve retornar erro 500 quando há erro na API do Spotify", async () => {
    const artistId = "invalid_id";

    (fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ error: "Not found" }),
    });

    const response = await request(app)
      .get(`/artists/${artistId}`)
      .expect(500);

    expect(response.body.error).toBeDefined();
  });
});
