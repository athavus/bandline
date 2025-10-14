<script lang="ts">
  import type { SpotifyArtist } from "../types/artist.ts";
  import SpotifyButton from "./SpotifyButton.svelte";
  import RelatedArtists from "./RelatedArtists.svelte";
  import { createEventDispatcher } from "svelte";

  export let artist: SpotifyArtist;

  const dispatch = createEventDispatcher();

  function openArtistInSpotify(e: Event) {
    e.stopPropagation();
    if (artist.id) {
      window.open(`https://open.spotify.com/artist/${artist.id}`, "_blank");
    }
  }

  function handleRelatedArtistSelect(event: CustomEvent) {
    dispatch("selectRelatedArtist", event.detail);
  }
</script>

<div class="artist-layout">
  <!-- Card principal do artista -->
  <div class="artist-card">
    <div class="artist-header">
      <!-- Descrição esticada -->
      <div class="description-section">
        <h3 class="section-title">Sobre:</h3>
        <div class="description-content">
          <p>{artist.description}</p>
        </div>
      </div>

      <!-- Informações do artista compactas -->
      <div class="artist-info-section">
        <div class="artist-info">
          <h2>{artist.name}</h2>
          {#if artist.genres.length > 0}
            <p class="genres">{artist.genres.join(" • ")}</p>
          {/if}
        </div>

        <div class="artist-content">
          <!-- Estatísticas à esquerda da imagem -->
          <div class="info-stats">
            <div class="info-item">
              <span class="label">Seguidores</span>
              <span class="value">
                {artist.total_followers?.toLocaleString("pt-BR") ?? "—"}
              </span>
            </div>
            <div class="info-item">
              <span class="label">Popularidade</span>
              <span class="value popularity">
                <span class="bar" style="--progress: {artist.popularity}%"
                ></span>
                {artist.popularity}/100
              </span>
            </div>
          </div>

          <!-- Imagem à direita -->
          <div class="artist-image-wrapper">
            {#if artist.image}
              <img src={artist.image} alt={artist.name} class="artist-image" />
            {:else if artist.images && artist.images.length > 0}
              <img
                src={artist.images[0].url}
                alt={artist.name}
                class="artist-image"
              />
            {/if}
            <SpotifyButton on:click={openArtistInSpotify} />
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Artistas relacionados -->
  <RelatedArtists {artist} on:selectArtist={handleRelatedArtistSelect} />
</div>

<style>
  .artist-layout {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 40px;
    align-items: start;
    max-width: 1400px;
    margin: 40px auto; /* Centraliza horizontalmente */
    padding: 0 20px;
  }

  .artist-card {
    width: 100%;
    max-width: 1000px;
    padding: 28px;
    border-radius: 16px;
    background: var(--bg-card);
    box-shadow: var(--shadow-md);
    border: 1px solid var(--border-color);
    animation: fadeIn 0.4s ease;
  }

  .artist-header {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 60px;
    align-items: stretch;
    min-height: 300px;
  }

  .description-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
    height: 100%;
    justify-content: flex-start;
  }

  .section-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
    margin-bottom: 4px;
  }

  .description-content {
    background: var(--bg-tertiary);
    border-radius: 12px;
    padding: 20px;
    border: 1px solid var(--border-light);
    width: 100%;
    flex: 1;
    display: flex;
    align-items: flex-start;
  }

  .description-content p {
    font-size: 0.95rem;
    line-height: 1.6;
    color: var(--text-secondary);
    margin: 0;
    text-align: justify;
    width: 100%;
  }

  .artist-info-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
    height: 100%;
    justify-content: space-between;
  }

  .artist-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
    text-align: end;
  }

  h2 {
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--accent-color);
    margin: 0;
  }

  .genres {
    font-size: 0.9rem;
    color: var(--text-secondary);
    margin: 0;
  }

  .artist-content {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .info-stats {
    display: flex;
    flex-direction: column;
    gap: 20px;
    flex: 1;
  }

  .artist-image-wrapper {
    position: relative;
    width: 220px;
    height: 220px;
    flex-shrink: 0;
  }

  .artist-image {
    width: 100%;
    height: 100%;
    border-radius: 12px;
    object-fit: cover;
    box-shadow: var(--shadow-md);
    transition: transform 0.3s ease;
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

  .info-item {
    background: var(--bg-tertiary);
    border-radius: 10px;
    padding: 20px 24px;
    border: 1px solid var(--border-light);
    display: flex;
    flex-direction: column;
    gap: 10px;
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
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
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

  /* Responsividade */
  @media (max-width: 1024px) {
    .artist-layout {
      grid-template-columns: 1fr;
      gap: 24px;
      max-width: 100%;
    }
  }

  @media (max-width: 768px) {
    .artist-layout {
      margin: 20px auto;
      padding: 0 16px;
      gap: 20px;
    }

    .artist-card {
      padding: 20px;
    }

    .artist-header {
      grid-template-columns: 1fr;
      gap: 20px;
      min-height: auto;
      align-items: start;
    }

    .artist-content {
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    .artist-info-section {
      height: auto;
      justify-content: flex-start;
    }

    .description-section {
      height: auto;
    }

    .artist-info {
      text-align: center;
    }

    h2 {
      text-align: center;
    }

    .genres {
      text-align: center;
    }

    .description-content {
      padding: 14px;
    }

    .section-title {
      font-size: 0.95rem;
    }

    .description-content p {
      font-size: 0.85rem;
    }

    .artist-image-wrapper {
      width: 100px;
      height: 100px;
    }
  }

  @media (max-width: 480px) {
    .artist-layout {
      margin: 16px auto;
      padding: 0 12px;
    }

    .artist-card {
      padding: 16px;
    }

    .artist-header {
      gap: 16px;
    }

    .artist-content {
      gap: 12px;
    }

    .artist-image-wrapper {
      width: 80px;
      height: 80px;
    }

    h2 {
      font-size: 1.5rem;
    }

    .description-content {
      padding: 12px;
    }

    .description-content p {
      font-size: 0.8rem;
    }
  }
</style>
