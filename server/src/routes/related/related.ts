import fetch from 'node-fetch';
import token from '../../api/token/token.ts';
import { Router } from 'express';

async function getRelatedArtists(artistId: string) {
  const relatedArtistsDataRequest = await fetch(
    `https://api.spotify.com/v1/artists/${artistId}/related-artists`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const relatedArtistsData = await relatedArtistsDataRequest.json();

  if (!relatedArtistsDataRequest.ok) {
    throw new Error(
      `Spotify API Error: ${relatedArtistsData.error?.message || 'Unknown error'}`
    );
  }

  return relatedArtistsData;
}

const router = Router();

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const rawRelatedArtists = await getRelatedArtists(id);
    res.json(rawRelatedArtists);
  } catch (err) {
    console.error('Erro ao buscar artistas relacionados:', err);
    res.status(500).json({
      error: "Não foi possível conseguir os artistas relacionados.",
      details: err instanceof Error ? err.message : 'Erro desconhecido'
    });
  }
});

export default router;
