import fetch from "node-fetch";
import { Router } from "express";
import getSpotifyToken from "../config/spotifyToken.ts";
import type {
  SpotifyArtist,
  SpotifyArtistsSearchResponse,
} from "../types/artists-types.ts";

const router = Router();
const token = await getSpotifyToken();

router.get("", async (req, res) => {
  try {
    const queryParam = typeof req.query.q === "string" ? req.query.q : "";

    if (!queryParam || queryParam.length < 2) {
      return res.json({ artists: [] });
    }

    const url = new URL("https://api.spotify.com/v1/search");
    url.searchParams.append("q", queryParam);
    url.searchParams.append("type", "artist");
    url.searchParams.append("limit", "10");

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erro: ${response.status}`);
    }

    const data = (await response.json()) as SpotifyArtistsSearchResponse;

    const artists = data.artists.items.map((artist: SpotifyArtist) => ({
      id: artist.id,
      name: artist.name,
      image: artist.images[0]?.url || null,
      popularity: artist.popularity,
      genres: artist.genres.slice(0, 3),
      total_followers: artist.followers.total,
    }));

    res.json({ artists });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar artistas" });
  }
});

export default router;
