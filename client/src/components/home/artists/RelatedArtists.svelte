<script lang="ts">
  import type { SpotifyArtist } from "../../../types/artist.ts";
  import { createEventDispatcher } from "svelte";

  export let artist: SpotifyArtist;

  const dispatch = createEventDispatcher();

  function handleArtistClick(artistName: string) {
    // Pega o input de busca
    const searchInput = document.getElementById(
      "search-input",
    ) as HTMLInputElement;

    if (searchInput) {
      // Coloca o nome do artista no input
      searchInput.value = artistName;

      // Dispara o evento de input para ativar a busca
      const inputEvent = new Event("input", { bubbles: true });
      searchInput.dispatchEvent(inputEvent);

      // Foca no input
      searchInput.focus();

      // Pequeno delay para garantir que os resultados apareceram
      setTimeout(() => {
        // Tenta clicar no primeiro resultado
        const firstResult = document.querySelector(
          ".search-result-item",
        ) as HTMLElement;
        if (firstResult) {
          firstResult.click();
        }
      }, 500);
    }
  }
</script>

<div class="related-artists-minimal">
  <h3 class="section-title">Artistas Relacionados</h3>
  {#if artist.relatedArtists && artist.relatedArtists.length > 0}
    <div class="minimal-list">
      {#each artist.relatedArtists as artistName}
        <button
          class="artist-button"
          on:click={() => handleArtistClick(artistName.name)}
          type="button"
        >
          <div class="artist-icon">
            <div class="music-wave">
              <span class="wave-bar"></span>
              <span class="wave-bar"></span>
              <span class="wave-bar"></span>
              <span class="wave-bar"></span>
              <span class="wave-bar"></span>
            </div>
          </div>
          <span class="artist-name">{artistName.name}</span>
          <div class="search-icon">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </div>
        </button>
      {/each}
    </div>
  {:else}
    <p class="empty">Nenhum artista relacionado encontrado.</p>
  {/if}
</div>

<style>
  .related-artists-minimal {
    width: 100%;
    max-width: 320px;
    margin: 0 auto;
    padding: 14px;
  }

  .section-title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary, #222);
    margin-bottom: 12px;
    text-align: center;
  }

  .minimal-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .artist-button {
    display: flex;
    align-items: center;
    gap: 10px;
    background: var(--bg-card, #fafafa);
    border: 1px solid var(--border-color, #eee);
    border-radius: 8px;
    padding: 10px 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: 0;
    width: 100%;
    text-align: left;
    font-family: inherit;
  }

  .artist-button:hover {
    background: var(--bg-hover, #f3f4f6);
    border-color: var(--accent-color, #b2becd);
    transform: translateX(2px);
  }

  .artist-button:active {
    transform: translateX(4px);
  }

  .artist-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: var(--accent-color);
    flex-shrink: 0;
  }

  /* Wavebar styles */
  .music-wave {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 2px;
    height: 14px;
  }

  .wave-bar {
    width: 2px;
    background: linear-gradient(180deg, #ffffff, rgba(255, 255, 255, 0.8));
    border-radius: 1px;
    animation: wave 1.2s ease-in-out infinite;
  }

  .wave-bar:nth-child(1) {
    height: 5px;
    animation-delay: 0s;
  }

  .wave-bar:nth-child(2) {
    height: 9px;
    animation-delay: 0.1s;
  }

  .wave-bar:nth-child(3) {
    height: 12px;
    animation-delay: 0.2s;
  }

  .wave-bar:nth-child(4) {
    height: 7px;
    animation-delay: 0.3s;
  }

  .wave-bar:nth-child(5) {
    height: 5px;
    animation-delay: 0.4s;
  }

  @keyframes wave {
    0%,
    100% {
      transform: scaleY(1);
    }
    50% {
      transform: scaleY(1.5);
    }
  }

  .artist-name {
    flex: 1;
    font-size: 0.92rem;
    color: var(--text-primary, #222);
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .search-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-secondary, #666);
    opacity: 0.6;
    transition: opacity 0.2s;
    flex-shrink: 0;
  }

  .artist-button:hover .search-icon {
    opacity: 1;
    color: var(--accent-color, #7c8db0);
  }

  .empty {
    text-align: center;
    font-size: 0.85rem;
    color: var(--text-secondary, #666);
    margin-top: 8px;
  }

  @media (max-width: 480px) {
    .related-artists-minimal {
      max-width: 100%;
      padding: 12px;
    }

    .artist-button {
      padding: 8px 10px;
    }

    .artist-name {
      font-size: 0.88rem;
    }

    .artist-icon {
      width: 28px;
      height: 28px;
    }

    .music-wave {
      height: 12px;
      gap: 1.5px;
    }

    .wave-bar {
      width: 1.5px;
    }

    .wave-bar:nth-child(1) {
      height: 4px;
    }

    .wave-bar:nth-child(2) {
      height: 7px;
    }

    .wave-bar:nth-child(3) {
      height: 10px;
    }

    .wave-bar:nth-child(4) {
      height: 6px;
    }

    .wave-bar:nth-child(5) {
      height: 4px;
    }
  }
</style>
