import fetch from "node-fetch";
import dotenv from "dotenv";
import type { SpotifyTokenResponse } from "../types/spotify-token-types.ts";

dotenv.config();

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;

if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
  console.log("As chaves da API não estão corretas");
}

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

async function getSpotifyToken(): Promise<string> {
  const now = Date.now();

  if (cachedToken && now < tokenExpiresAt) {
    return cachedToken;
  }

  const auth = Buffer.from(
    `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`,
  ).toString("base64");

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${auth}`,
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
  });

  const data: SpotifyTokenResponse =
    (await response.json()) as SpotifyTokenResponse;

  if (!response.ok) {
    throw new Error(`Erro ao obter o token: ${response.statusText}`);
  }

  cachedToken = data.access_token;
  tokenExpiresAt = now + data.expires_in * 1000 - 5000;

  return cachedToken;
}

export default getSpotifyToken;
