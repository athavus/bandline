import type { SpotifyArtist, SearchArtistResult } from "../types/artist";
import { language } from "../lib/stores/language";
import { get } from "svelte/store";

const API_URL = import.meta.env.VITE_API_URL;

export async function getArtistData(id: string): Promise<SpotifyArtist> {
  const currentLang = get(language);
  const response = await fetch(`${API_URL}/artists/${id}?lang=${currentLang}`);
  if (!response.ok) {
    throw new Error("Erro ao buscar os dados do artista");
  }
  const dados = (await response.json()) as SpotifyArtist;
  return dados;
}

let debounceTimer: number;

export async function searchArtists(query: string): Promise<{ artists: SearchArtistResult[] }> {
  return new Promise((resolve) => {
    clearTimeout(debounceTimer);
    if (query.length < 2) {
      resolve({ artists: [] });
      return;
    }
    debounceTimer = setTimeout(async () => {
      try {
        const response = await fetch(`${API_URL}/searchArtists?q=${encodeURIComponent(query)}`);
        if (!response.ok) {
          console.error(`Erro HTTP: ${response.status} - ${response.statusText}`);
          resolve({ artists: [] });
          return;
        }
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          console.error('Resposta não é JSON:', text);
          resolve({ artists: [] });
          return;
        }
        const data = await response.json();
        resolve(data);
      } catch (error) {
        console.error('Erro ao buscar artistas:', error);
        resolve({ artists: [] });
      }
    }, 300);
  });
}

export async function getArtistAlbums(artistId: string) {
  try {
    const response = await fetch(`${API_URL}/artistAlbums/${artistId}`);
    if (!response.ok) {
      throw new Error('Falha ao buscar álbuns do artista');
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar álbuns:', error);
    throw error;
  }
}

export async function getAlbumTracks(albumId: string) {
  try {
    const response = await fetch(`${API_URL}/albumTracks/${albumId}`);
    if (!response.ok) {
      throw new Error('Falha ao buscar faixas do álbum');
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar faixas:', error);
    throw error;
  }
}
