import fetch from 'node-fetch';
import dotenv from 'dotenv';

import type { SpotifyTokenResponse } from '../types/token.ts';

dotenv.config();

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;

if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
  console.log("As chaves da API não estão corretas");
}

const auth = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');

const spotifyTokenResponse = await fetch('https://accounts.spotify.com/api/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: `Basic ${auth}`
  },

  body: new URLSearchParams({ grant_type: 'client_credentials' })
});

const spotifyTokenData: SpotifyTokenResponse = await spotifyTokenResponse.json() as SpotifyTokenResponse;
const accessToken = spotifyTokenData.access_token;

export default accessToken;
