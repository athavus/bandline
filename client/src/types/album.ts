import type { SpotifyImage } from "./images";
import type { SpotifyArtist } from "./artist";

export interface SpotifyAlbumItem {
  total_tracks: number;
  href: string;
  id: string;
  images: SpotifyImage[];
  name: string;
  release_date: string;
  artists: SpotifyArtist[];
}

export interface SpotifyAlbums {
  total_amount: number;
  items: SpotifyAlbumItem[];
}
