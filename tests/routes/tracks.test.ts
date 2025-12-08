import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockSpotifyTracksResponse } from "../setup/mocks";

vi.mock("node-fetch", () => ({
  default: vi.fn(),
}));

vi.mock("../../server/src/config/spotifyToken", () => ({
  default: async () => "mock_test_token",
}));

import request from "supertest";
import { createTestApp } from "../setup/test-app";
import fetch from "node-fetch";

const app = createTestApp();

describe("GET /albumTracks/:id", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve retornar faixas do álbum com sucesso", async () => {
    const albumId = "1To7kv722A8SpZF7M07D4p";

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockSpotifyTracksResponse,
    });

    const response = await request(app)
      .get(`/albumTracks/${albumId}`)
      .expect(200);

    expect(response.body).toHaveProperty("total_tracks");
    expect(response.body).toHaveProperty("items");
    expect(response.body.items).toBeInstanceOf(Array);

    if (response.body.items.length > 0) {
      expect(response.body.items[0]).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        track_number: expect.any(Number),
        duration_ms: expect.any(Number),
        artists: expect.any(Array),
      });
    }
  });

  it("deve mapear corretamente as propriedades das faixas", async () => {
    const albumId = "1To7kv722A8SpZF7M07D4p";

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockSpotifyTracksResponse,
    });

    const response = await request(app)
      .get(`/albumTracks/${albumId}`)
      .expect(200);

    const track = response.body.items[0];
    if (track) {
      expect(track).toHaveProperty("id");
      expect(track).toHaveProperty("name");
      expect(track).toHaveProperty("track_number");
      expect(track).toHaveProperty("duration_ms");
      expect(track).toHaveProperty("href");
      expect(track).toHaveProperty("artists");
      expect(Array.isArray(track.artists)).toBe(true);
    }
  });

  it("deve retornar erro 500 quando há erro na API do Spotify", async () => {
    const albumId = "invalid_id";

    (fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ error: "Not found" }),
    });

    const response = await request(app)
      .get(`/albumTracks/${albumId}`)
      .expect(500);

    expect(response.body.error).toBeDefined();
  });
});
