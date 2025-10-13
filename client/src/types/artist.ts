export interface SpotifyArtist {
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
  uri: string,
  description?: string
};

export interface SearchArtistResult {
  id: string;
  name: string;
  image: string | null;
  popularity: number;
  genres: string[];
  total_followers: number;
}


