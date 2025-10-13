<script lang="ts">
  import type { SpotifyArtist } from "../types/artist.ts";
  import SpotifyButton from "./SpotifyButton.svelte";
  export let artist: SpotifyArtist;

  function openArtistInSpotify(e: Event) {
    e.stopPropagation();
    if (artist.id) {
      window.open(`https://open.spotify.com/artist/${artist.id}`, "_blank");
    }
  }
</script>

<div class="artist-card">
  <div class="artist-header">
    <div class="artist-info">
      <h2>{artist.name}</h2>
      {#if artist.genres.length > 0}
        <p class="genres">{artist.genres.join(" • ")}</p>
      {/if}
    </div>
    <div class="artist-image-wrapper">
      {#if artist.image}
        <img src={artist.image} alt={artist.name} class="artist-image" />
      {:else if artist.images && artist.images.length > 0}
        <img src={artist.images[0].url} alt={artist.name} class="artist-image" />
      {/if}
      <SpotifyButton on:click={openArtistInSpotify} />
    </div>
    
    <div class="info-grid-header">
      <div class="info-item">
        <span class="label">Popularidade</span>
        <span class="value popularity">
          <span class="bar" style="--progress: {artist.popularity}%"></span>
          {artist.popularity}/100
        </span>
      </div>
      <div class="info-item">
        <span class="label">Seguidores</span>
        <span class="value">
          {artist.total_followers?.toLocaleString("pt-BR") ?? "—"}
        </span>
      </div>
    </div>
  </div>
</div>

<style>
  .artist-card {
    width: 100%;
    max-width: 760px;
    margin: 40px auto;
    padding: 28px;
    border-radius: 16px;
    background: var(--bg-card);
    box-shadow: var(--shadow-md);
    border: 1px solid var(--border-color);
    animation: fadeIn 0.4s ease;
  }

  .artist-header {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 24px;
    align-items: stretch;
  }

  .artist-image-wrapper {
    position: relative;
    width: 200px;
    height: 100%;
    min-height: 200px;
    grid-column: 2;
    grid-row: 1 / span 2;
  }

  .artist-image {
    width: 100%;
    height: 100%;
    border-radius: 12px;
    object-fit: cover;
    box-shadow: var(--shadow-md);
    transition: transform 0.3s ease;
  }

  .artist-info {
    display: flex;
    flex-direction: column;
    gap: 12px;
    text-align: right;
  }

  h2 {
    font-size: 2rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 8px;
    text-align: right;
  }

  .genres {
    font-size: 0.95rem;
    color: var(--text-secondary);
    margin-bottom: 12px;
    text-align: right;
  }

  .spotify-button {
    display: inline-block;
    background: var(--accent-color);
    color: #fff;
    font-weight: 600;
    padding: 10px 18px;
    border-radius: 8px;
    text-decoration: none;
    transition: background 0.3s ease;
    margin-bottom: 16px;
    width: fit-content;
  }

  .spotify-button:hover {
    background: rgba(var(--accent-rgb), 0.8);
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
    margin-top: 16px;
  }

  .info-grid-header {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    grid-column: 1;
  }

  .info-item {
    background: var(--bg-tertiary);
    border-radius: 10px;
    padding: 14px 16px;
    border: 1px solid var(--border-light);
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .label {
    font-size: 0.9rem;
    color: var(--text-secondary);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  .value {
    font-size: 1rem;
    color: var(--text-primary);
    font-weight: 600;
  }

  .popularity {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .bar {
    flex: 1;
    height: 6px;
    background: rgba(var(--accent-rgb), 0.2);
    border-radius: 3px;
    position: relative;
  }

  .bar::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: var(--progress);
    background: var(--gradient-primary);
    border-radius: 3px;
    transition: width 0.3s ease;
  }

  .image-gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 10px;
    margin-top: 24px;
  }

  .gallery-img {
    width: 100%;
    aspect-ratio: 1/1;
    border-radius: 8px;
    object-fit: cover;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .gallery-img:hover {
    transform: scale(1.04);
    box-shadow: var(--shadow-lg);
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
