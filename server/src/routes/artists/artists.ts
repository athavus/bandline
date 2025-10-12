import fetch from 'node-fetch';
import token from "@token/spotifyToken";
import { Router } from 'express';

import type { SpotifyArtist } from './types.ts';

async function getArtistData(artistId: string) {
  const artistDataRequest = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const artistData: SpotifyArtist = await artistDataRequest.json() as SpotifyArtist;

  return artistData;
}

const router = Router();

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const rawArtist = await getArtistData(id);

    const filteredArtist = {
      id: rawArtist.id,
      name: rawArtist.name,
      total_followers: rawArtist.followers.total,
      popularity: rawArtist.popularity,
      image: rawArtist.images[0]?.url,
      genres: rawArtist.genres
    }

    res.json(filteredArtist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Não foi possível conseguir o artista do spotify" })
  }
});

export default router;
