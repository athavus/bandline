import fetch from 'node-fetch';
import token from '../../api/token/token.ts';
import { Router } from 'express';
import type { SpotifyAlbums } from './types.ts';

async function getArtistAlbums(artistId: string) {
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

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const rawAlbums: SpotifyAlbums = (await getArtistAlbums(id)) as SpotifyAlbums;

    const filteredItems = rawAlbums.items.map(item => ({
      id: item.id,
      total_tracks: item.total_tracks,
      href: item.href,
      images: item.images,
      name: item.name,
      release_date: item.release_date,
      artists: item.artists.map(artist => ({
        href: artist.href,
        id: artist.id,
        name: artist.name
      }))
    })).sort((a, b) => {
      const dateA = a.release_date.length === 4 ? `${a.release_date}-01-01` :
        a.release_date.length === 7 ? `${a.release_date}-01` :
          a.release_date;
      const dateB = b.release_date.length === 4 ? `${b.release_date}-01-01` :
        b.release_date.length === 7 ? `${b.release_date}-01` :
          b.release_date;
      return new Date(dateA).getTime() - new Date(dateB).getTime();
    });

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

export default router;
