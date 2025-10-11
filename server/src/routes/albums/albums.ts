import fetch from 'node-fetch';
import token from '../../api/token/token.ts';
import { Router } from 'express';
import type { SpotifyAlbums } from './types.ts';

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
    const rawAlbums: SpotifyAlbums = (await getArtistAlbums(id)) as SpotifyAlbums;

    const filteredItems = rawAlbums.items.map(item => ({
      total_tracks: item.total_tracks,
      href: item.href,
      id: item.id,
      images: item.images,
      name: item.name,
      release_date: item.release_date,
      artists: item.artists.map(artist => ({
        href: artist.href,
        id: artist.id,
        name: artist.name
      }))
    }));

    const filteredAlbums = {
      total_amount: rawAlbums.total,
      items: filteredItems
    };

    res.json(filteredAlbums);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Não foi possível conseguir os álbuns dos artistas." })
  }
})
