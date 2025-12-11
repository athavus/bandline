
import getSpotifyToken from "../config/spotifyToken.ts";
import { Router } from "express";
import type { SpotifyAlbumTracks } from "../types/tracks-types.ts";

const router = Router();

async function getAlbumTracks(albumId: string) {
  const token = await getSpotifyToken(); // ← MOVIDO PARA CÁ

  const url = new URL(`https://api.spotify.com/v1/albums/${albumId}/tracks`);
  url.searchParams.append("limit", "50");

  const albumTracksResponse = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const albumTracksData = await albumTracksResponse.json();
  return albumTracksData;
}

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const rawTracks: SpotifyAlbumTracks = (await getAlbumTracks(
      id,
    )) as SpotifyAlbumTracks;

    const filteredTracks = rawTracks.items.map((track) => ({
      id: track.id,
      artists: track.artists.map((artist) => ({
        id: artist.id,
        name: artist.name,
        href: artist.href,
      })),
      name: track.name,
      track_number: track.track_number,
      duration_ms: track.duration_ms,
      href: track.href,
    }));

    const response = {
      total_tracks: rawTracks.total,
      items: filteredTracks,
    };

    res.json(response);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Não foi possível conseguir as músicas do álbum." });
  }
});

export default router;
