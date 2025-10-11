export interface SpotifyAlbumTracks {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: SpotifyTrack[];
}

export interface SpotifyTrack {
  artists: SpotifyArtist[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  href: string;
  id: string;
  name: string;
  preview_url: string | null;
  track_number: number;
  type: string;
  uri: string;
}

interface SpotifyArtist {
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}
