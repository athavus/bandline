import { vi } from "vitest";

/**
 * Mock do token do Spotify
 */
export const mockSpotifyToken = "mock_spotify_token_12345";

/**
 * Mock da resposta da API do Spotify para artista
 */
export const mockSpotifyArtistResponse = {
  id: "4Z8W4fKeB5YxbusRsdQVPb",
  name: "Radiohead",
  followers: { total: 8500000 },
  popularity: 85,
  images: [
    {
      url: "https://i.scdn.co/image/ab67616d0000b273c5649add07ed3720be9d5526",
      height: 640,
      width: 640,
    },
  ],
  genres: ["alternative rock", "art rock", "britpop"],
};

/**
 * Mock da resposta da API do Spotify para busca de artistas
 */
export const mockSpotifyArtistsSearchResponse = {
  artists: {
    items: [
      {
        id: "4Z8W4fKeB5YxbusRsdQVPb",
        name: "Radiohead",
        images: [
          {
            url: "https://i.scdn.co/image/ab67616d0000b273c5649add07ed3720be9d5526",
            height: 640,
            width: 640,
          },
        ],
        popularity: 85,
        genres: ["alternative rock", "art rock", "britpop"],
        followers: { total: 8500000 },
      },
    ],
  },
};

/**
 * Mock da resposta da API do Spotify para álbuns
 */
export const mockSpotifyAlbumsResponse = {
  total: 15,
  items: [
    {
      id: "1To7kv722A8SpZF7M07D4p",
      name: "OK Computer",
      release_date: "1997-05-21",
      total_tracks: 12,
      href: "https://api.spotify.com/v1/albums/1To7kv722A8SpZF7M07D4p",
      images: [
        {
          url: "https://i.scdn.co/image/ab67616d0000b273c5649add07ed3720be9d5526",
          height: 640,
          width: 640,
        },
      ],
      artists: [
        {
          id: "4Z8W4fKeB5YxbusRsdQVPb",
          name: "Radiohead",
          href: "https://api.spotify.com/v1/artists/4Z8W4fKeB5YxbusRsdQVPb",
        },
      ],
    },
  ],
};

/**
 * Mock da resposta da API do Spotify para faixas
 */
export const mockSpotifyTracksResponse = {
  total: 12,
  items: [
    {
      id: "3n3Ppam7vgaVa1oRU5vZ4Y",
      name: "Airbag",
      track_number: 1,
      duration_ms: 284000,
      href: "https://api.spotify.com/v1/tracks/3n3Ppam7vgaVa1oRU5vZ4Y",
      artists: [
        {
          id: "4Z8W4fKeB5YxbusRsdQVPb",
          name: "Radiohead",
          href: "https://api.spotify.com/v1/artists/4Z8W4fKeB5YxbusRsdQVPb",
        },
      ],
    },
  ],
};

/**
 * Mock da resposta da API do Last.fm para descrição do artista
 */
export const mockLastFmArtistInfoResponse = {
  artist: {
    bio: {
      summary:
        "Radiohead is an English rock band formed in Abingdon, Oxfordshire, in 1985. <a href='https://www.last.fm/music/Radiohead'>Read more</a>",
    },
  },
};

/**
 * Mock da resposta da API do Last.fm para artistas relacionados
 */
export const mockLastFmSimilarArtistsResponse = {
  similarartists: {
    artist: [
      { name: "The Smashing Pumpkins" },
      { name: "Pixies" },
      { name: "Muse" },
      { name: "Arcade Fire" },
      { name: "Interpol" },
    ],
  },
};

/**
 * Mock do token do Spotify
 */
export const mockSpotifyTokenResponse = {
  access_token: mockSpotifyToken,
  token_type: "Bearer",
  expires_in: 3600,
};
