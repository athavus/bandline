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

export async function getArtistData(id: string): Promise<SpotifyArtist> {
  const response = await fetch(`http://localhost:3000/artists/${id}`);
  if (!response.ok) {
    throw new Error("Erro ao buscar os dados do artista");
  }

  const dados = (await response.json()) as SpotifyArtist;

  return dados;
}
