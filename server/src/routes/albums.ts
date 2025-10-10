import fetch from 'node-fetch';
import token from '../api/token.ts';
import { Router } from 'express';

export async function getArtistAlbums(artistId: string) {
  const url = new URL(`https://api.spotify.com/v1/artists/${artistId}/albums`);
  url.searchParams.append('limit', '50');

  const artistDataRequest = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const artistData = await artistDataRequest.json();
  return artistData;
}

const router = Router();

export default router.get('/:id/albums', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);

    const rawAlbums = await getArtistAlbums(id);
    res.json(rawAlbums);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Não foi possível conseguir os álbuns dos artistas." })
  }
})
