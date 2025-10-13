import fetch from 'node-fetch';
import token from "../config/spotifyToken";
import { Router } from 'express';
import dotenv from 'dotenv';

import type { SpotifyArtist } from '../types/artists-types.ts';

dotenv.config();

const LASTFM_API_KEY = process.env.LASTFM_API_KEY;

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

function cleanDescription(rawText: string): string {
  // Remove tags HTML
  let cleanText = rawText.replace(/<[^>]*>?/gm, '');

  // Remover tudo a partir de "Read more"
  if (cleanText.includes('Read more')) {
    cleanText = cleanText.split('Read more')[0];
  }

  // Se existir "Members", remover a palavra
  if (cleanText.includes('Members')) {
    cleanText = cleanText.replace(/\bMembers\b/g, '');
  }

  // Se existir "Formation", remover a palavra e colocar ponto final após "(drums)"
  if (cleanText.includes('Formation')) {
    cleanText = cleanText.replace(/\bFormation\b/g, '');
    cleanText = cleanText.replace(/\(drums\)(?!\.)/g, '(drums).');
  }

  // Substituir múltiplos \n e espaços por um único espaço e trim
  cleanText = cleanText.replace(/[\n\s]+/g, ' ').trim();

  return cleanText;
}
async function getArtistDescription(artistName: string) {
  const url = `http://ws.audioscrobbler.com/2.0/?method=artist.getInfo&artist=${encodeURIComponent(artistName)}&api_key=${LASTFM_API_KEY}&format=json`;
  const response = await fetch(url);
  if (!response.ok) {
    return null;
  }

  const data = await response.json();

  if (data && data.artist && data.artist.bio && data.artist.bio.summary) {
    const rawSummary = data.artist.bio.summary;
    return cleanDescription(rawSummary);
  }

  return null;
}

const router = Router();

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const rawArtist = await getArtistData(id);
    const description = await getArtistDescription(rawArtist.name);

    const filteredArtist = {
      id: rawArtist.id,
      name: rawArtist.name,
      total_followers: rawArtist.followers.total,
      popularity: rawArtist.popularity,
      image: rawArtist.images[0]?.url,
      genres: rawArtist.genres,
      description
    };

    res.json(filteredArtist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Não foi possível conseguir o artista do spotify ou a descrição do last.fm" });
  }
});
export default router;
