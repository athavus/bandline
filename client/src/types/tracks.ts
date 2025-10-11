import type { SpotifyArtist } from "./artist";

export interface SpotifyTrack {
  artists: SpotifyArtist[];
  id: string;
  name: string;
  track_number: number;
  duration_ms: number;
  href: string;
}

export interface SpotifyAlbumTracks {
  total_tracks: number;
  items: SpotifyTrack[];
}
