import { describe, it, expect, vi, beforeEach } from "vitest";

// 2. SEGUNDO: Configure os mocks ANTES de importar qualquer módulo que os use
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

vi.mock("../../server/src/config/spotifyToken", () => ({
  default: vi.fn(async () => "mock_test_token"),
}));

// 3. TERCEIRO: Importe o mock de dados
import { mockSpotifyTracksResponse } from "../setup/mocks";

// 4. QUARTO: Importe o resto
import request from "supertest";
import { createTestApp } from "../setup/test-app";

describe("GET /albumTracks/:id", () => {
  let app: any;

  beforeEach(() => {
    vi.clearAllMocks();
    // IMPORTANTE: Cria o app DEPOIS de limpar os mocks
    app = createTestApp();
  });

  it("deve retornar faixas do álbum com sucesso", async () => {
    const albumId = "7HpyNnONRvryrDxanTrysA";

    // Configura o mock
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockSpotifyTracksResponse,
    });

    const response = await request(app)
      .get(`/albumTracks/${albumId}`)
      .expect(200);
  });

  it("deve mapear corretamente as propriedades das faixas", async () => {
    const albumId = "7HpyNnONRvryrDxanTrysA";

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockSpotifyTracksResponse,
    });

    const response = await request(app)
      .get(`/albumTracks/${albumId}`)
      .expect(200);
  });

  it("deve retornar erro 500 quando há erro na API do Spotify", async () => {
    const albumId = "invalid_id";

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ error: { message: "Not found" } }),
    });

    const response = await request(app)
      .get(`/albumTracks/${albumId}`)
      .expect(500);

    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe(
      "Não foi possível conseguir as músicas do álbum.",
    );
  });
});
