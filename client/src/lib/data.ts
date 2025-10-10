interface SpotifyArtist {
  external_urls: {
    spotify: string
  },
  followers: {
    href: string | null,
    total: number,
  },
  genres: string[],
  id: string,
  images: {
    url: string,
    height: number,
    width: number,
  }[],
  name: string,
  popularity: number,
  type: string,
  uri: string
};

interface SearchArtistResult {
  id: string;
  name: string;
  image: string | null;
  popularity: number;
  genres: string[];
  total_followers: number;
}

const API_URL = 'http://localhost:3000';

export async function getArtistData(id: string): Promise<SpotifyArtist> {
  const response = await fetch(`${API_URL}/artists/${id}`);
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
        const data = await response.json();
        resolve(data);
      } catch (error) {
        console.error('Erro ao buscar artistas:', error);
        resolve({ artists: [] });
      }
    }, 300);
  });
}
