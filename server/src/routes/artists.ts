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

type ArtistDescription = {
  method: string,
  artist: string,
  api_key: string,
  format: string,
  lang: string
}

async function getArtistDescription(artistName: string, preferredLang: string) {
  const baseURL = "http://ws.audioscrobbler.com/2.0";
  const params = new URLSearchParams({
    method: "artist.getInfo",
    artist: artistName,
    api_key: LASTFM_API_KEY,
    format: "json",
    lang: preferredLang
  } as ArtistDescription);

  const fetchInfo = async (lang: string) => {
    const url = `${baseURL}?${params.toString().replace(`lang=${preferredLang}`, `lang=${lang}`)}`;
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    return data?.artist?.bio?.summary ? cleanDescription(data.artist.bio.summary) : null;
  };

  let description = await fetchInfo(preferredLang);
  if (!description) {
    description = await fetchInfo("en");
  }

  return description;
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
    // Pega o idioma da query string, defaultando para 'en' se não for fornecido
    const lang = (req.query.lang as string) || 'en';

    // Valida o idioma para garantir que seja um dos aceitos
    const validLangs = ['en', 'pt', 'es'];
    const selectedLang = validLangs.includes(lang) ? lang : 'en';

    const rawArtist = await getArtistData(id);
    const description = await getArtistDescription(rawArtist.name, selectedLang);
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
