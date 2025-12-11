import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockSpotifyArtistsSearchResponse } from "../setup/mocks";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

vi.mock("../../server/src/config/spotifyToken", () => ({
  default: async () => "mock_test_token",
}));


import request from "supertest";
import { createTestApp } from "../setup/test-app";

const app = createTestApp();

describe("GET /searchArtists", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve retornar lista vazia quando query é muito curta", async () => {
    const response = await request(app).get("/searchArtists?q=a").expect(200);

    expect(response.body.artists).toEqual([]);
  });

  it("deve retornar lista vazia quando query não é fornecida", async () => {
    const response = await request(app).get("/searchArtists").expect(200);

    expect(response.body.artists).toEqual([]);
  });

  it("deve buscar artistas com sucesso e retornar uma mensagem de status 200", async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockSpotifyArtistsSearchResponse,
    });

    const response = await request(app)
      .get("/searchArtists?q=Radiohead")
      .expect(200);
  });

  it("deve retornar erro 500 quando há erro na API do Spotify", async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: "Internal Server Error" }),
    });

    const response = await request(app)
      .get("/searchArtists?q=Radiohead")
      .expect(500);

    expect(response.body.error).toBe("Erro ao buscar artistas");
  });
});
