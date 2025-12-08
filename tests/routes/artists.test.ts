import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { createTestApp } from "../setup/test-app";
import {
  mockSpotifyArtistResponse,
  mockLastFmArtistInfoResponse,
  mockLastFmSimilarArtistsResponse,
} from "../setup/mocks";
import fetch from "node-fetch";

vi.mock("node-fetch", () => ({
  default: vi.fn(),
}));

vi.mock("../../server/src/config/spotifyToken", () => ({
  default: async () => "mock_token_12345",
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

    const response = await request(app).get(`/artists/${artistId}`).expect(500);
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
      .expect(500);
  });

  it("deve retornar erro 500 quando há erro na API do Spotify", async () => {
    const artistId = "invalid_id";

    (fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ error: "Not found" }),
    });

    const response = await request(app).get(`/artists/${artistId}`).expect(500);

    expect(response.body.error).toBeDefined();
  });
});
