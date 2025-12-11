import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { createTestApp } from "../setup/test-app";

// Stub global fetch
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

// Mock token Spotify
vi.mock("../../server/src/config/spotifyToken", () => ({
    default: async () => "mock_nodb_token",
}));

// Criar app (que vai usar o prisma mockado pelo setup-no-db)
const app = createTestApp();

describe("External APIs (No Database Required)", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("Spotify Search API", () => {
        it("deve buscar artistas e retornar 200 (Mocked)", async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: async () => ({
                    artists: {
                        items: [
                            {
                                id: "1",
                                name: "NoDB Artist",
                                images: [],
                                popularity: 100,
                                genres: ["rock"],
                                followers: { total: 1000 },
                            },
                        ],
                        total: 1,
                        limit: 20,
                        offset: 0,
                        href: "url",
                        next: null,
                        previous: null,
                    }
                }),
            });

            const response = await request(app)
                .get("/searchArtists?q=NoDB")
                .expect(200);

            expect(response.body.artists).toHaveLength(1);
            expect(response.body.artists[0].name).toBe("NoDB Artist");
        });
    });

    describe("Spotify Tracks API", () => {
        it("deve buscar faixas do álbum e retornar 200 (Mocked)", async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: async () => ({
                    id: "album1",
                    total: 1,
                    items: [
                        {
                            id: "t1",
                            name: "NoDB Track",
                            track_number: 1,
                            duration_ms: 30000,
                            href: "href",
                            artists: [{ id: "a1", name: "Art", href: "href" }]
                        }
                    ]
                }),
            });

            const response = await request(app)
                .get("/albumTracks/album1")
                .expect(200);

            expect(response.body.items).toHaveLength(1);
            expect(response.body.items[0].name).toBe("NoDB Track");
        });
    });
});
