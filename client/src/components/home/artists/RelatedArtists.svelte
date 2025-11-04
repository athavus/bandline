<script lang="ts">
  import type { SpotifyArtist } from "../../../types/artist.ts";
  import { createEventDispatcher } from "svelte";
  import "./RelatedArtists.css";

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
