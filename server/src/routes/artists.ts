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
  let cleanText = rawText.replace(/<[^>]*>?/gm, '');

  if (cleanText.includes('Read more')) {
    cleanText = cleanText.split('Read more')[0];
  }

  if (cleanText.includes('Members')) {
    cleanText = cleanText.replace(/\bMembers\b/g, '');
  }

  if (cleanText.includes('Formation')) {
    cleanText = cleanText.replace(/\bFormation\b/g, '');
    cleanText = cleanText.replace(/\(drums\)(?!\.)/g, '(drums).');
  }

  cleanText = cleanText.replace(/[\n\s]+/g, ' ').trim();
  return cleanText;
}

async function getArtistDescription(artistName: string) {
  const url = new URL("http://ws.audioscrobbler.com/2.0");
  url.searchParams.append('method', 'artist.getInfo');
  url.searchParams.append('artist', `${encodeURIComponent(artistName)}`);
  url.searchParams.append('api_key', `${LASTFM_API_KEY}`);
  url.searchParams.append('format', 'json');
  url.searchParams.append('lang', 'pt');

  console.log(url);

  let response = await fetch(url);
  if (!response.ok) return null;
  let data = await response.json();

  if (data?.artist?.bio?.summary) {
    return cleanDescription(data.artist.bio.summary);
  }

  url.searchParams.delete('lang');
  url.searchParams.append('lang', 'en');
  console.log(url);
  response = await fetch(url);
  if (!response.ok) return null;
  data = await response.json();

  if (data?.artist?.bio?.summary) {
    return cleanDescription(data.artist.bio.summary);
  }

  return null;
}

type RelatedArtist = {
  name: string;
  image: string | null;
};

function sliceRelatedArtists(lastFmRelatedArtists: any): RelatedArtist[] {
  if (
    !lastFmRelatedArtists?.similarartists?.artist ||
    !Array.isArray(lastFmRelatedArtists.similarartists.artist)
  ) {
    return [];
  }

  // mapeia para pegar só o `name` e a imagem de tamanho `medium` (ou pega a primeira imagem se medium não existir)
  return lastFmRelatedArtists.similarartists.artist.map((artist: any) => {
    return {
      name: artist.name,
    };
  });
}

async function getRelatedArtists(artistName: string) {
  const url = new URL(`http://ws.audioscrobbler.com/2.0`);
  url.searchParams.append('method', 'artist.getSimilar');
  url.searchParams.append('artist', `${encodeURIComponent(artistName)}`);
  url.searchParams.append('api_key', `${LASTFM_API_KEY}`);
  url.searchParams.append('format', 'json');
  url.searchParams.append('limit', '5');

  const relatedArtistsResponse = await fetch(url);

  const data = await relatedArtistsResponse.json();

  return sliceRelatedArtists(data);
}

const router = Router();

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const rawArtist = await getArtistData(id);
    const description = await getArtistDescription(rawArtist.name);
    const relatedArtists = await getRelatedArtists(rawArtist.name);

    const filteredArtist = {
      id: rawArtist.id,
      name: rawArtist.name,
      total_followers: rawArtist.followers.total,
      popularity: rawArtist.popularity,
      image: rawArtist.images[0]?.url,
      genres: rawArtist.genres,
      description,
      relatedArtists
    };

    res.json(filteredArtist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Não foi possível conseguir o artista do spotify ou a descrição do last.fm" });
  }
});
export default router;
