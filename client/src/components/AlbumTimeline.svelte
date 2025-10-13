<script lang="ts">
  // removed unused dispatcher
  import type { SpotifyAlbums } from '../types/album.ts';
  import type { SpotifyAlbumTracks } from '../types/tracks.ts';
  import AlbumCard from './AlbumCard.svelte';
  import TracksPanel from './TracksPanel.svelte';
  import LoadingSpinner from './LoadingSpinner.svelte';
  import NavigationButton from './NavigationButton.svelte';

  export let artistId: string = '';

  let albums: SpotifyAlbums | null = null;
  let selectedAlbum: any = null;
  let albumTracks: SpotifyAlbumTracks | null = null;
  let loading = false;
  let tracksLoading = false;
  let error: string | null = null;
  let sliderElement: HTMLElement;

  // no dispatch usage

  function scroll(amount: number) {
    sliderElement?.scrollBy({ left: amount, behavior: 'smooth' });
  }

  async function loadAlbums() {
    if (!artistId) return;
    loading = true;
    error = null;
    albums = null;
    selectedAlbum = null; // Reset selected album
    try {
      const res = await fetch(`http://localhost:3000/artistAlbums/${artistId}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      albums = await res.json();
    } catch (err) {
      error = err instanceof Error ? err.message : 'Erro desconhecido';
    } finally {
      loading = false;
    }
  }

  async function loadAlbumTracks(albumId: string) {
    tracksLoading = true;
    try {
      const res = await fetch(`http://localhost:3000/albumTracks/${albumId}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      albumTracks = await res.json();
    } catch {
      albumTracks = null;
    } finally {
      tracksLoading = false;
    }
  }

  function handleAlbumClick(album: any) {
    if (selectedAlbum?.id === album.id) {
      selectedAlbum = null;
      albumTracks = null;
    } else {
      selectedAlbum = album;
      loadAlbumTracks(album.id);
    }
  }

  function getTimelineX(i: number) {
    return 200 + i * 300;
  }

  function getTotalWidth() {
    return albums?.items ? getTimelineX(albums.items.length - 1) + 200 : 0;
  }


  $: if (albums?.items && albums.items.length > 0 && !selectedAlbum) {
    selectedAlbum = albums.items[0];
    loadAlbumTracks(selectedAlbum.id);
  }

  $: artistId && loadAlbums();
</script>

{#if loading}
  <LoadingSpinner text="Carregando discografia..." />
{:else if error}
  <div class="error">
    <p>❌ Erro ao carregar discografia: {error}</p>
    <button on:click={loadAlbums}>Tentar novamente</button>
  </div>
{:else if albums?.items?.length}
  <div class="timeline-container">
    <div class="timeline-wrapper">
      <NavigationButton
        direction="prev"
        on:click={() => scroll(-400)}
        aria-label="Anterior"
      />
      
      <div class="timeline-slider" bind:this={sliderElement}>
        <div class="timeline-track" style="width: {getTotalWidth()}px">
          <div class="timeline-dots">
            {#each albums.items as _album, i}
              <span
                class="timeline-dot {selectedAlbum?.id === _album.id ? 'active' : ''}"
                style="left: {getTimelineX(i)}px"
              ></span>
            {/each}
          </div>
          {#each albums.items as album, i (album.id)}
            <AlbumCard
              {album}
              position={getTimelineX(i) - 90}
              active={selectedAlbum?.id === album.id}
              on:click={() => handleAlbumClick(album)}
            />
          {/each}
        </div>
      </div>

      <NavigationButton
        direction="next"
        on:click={() => scroll(400)}
        aria-label="Próximo"
      />
    </div>

    {#if selectedAlbum}
      <TracksPanel
        album={selectedAlbum}
        {albumTracks}
        loading={tracksLoading}
        on:close={() => handleAlbumClick(selectedAlbum)}
      />
    {/if}
  </div>
{:else}
  <div class="no-albums">
    <p>Nenhum álbum encontrado para este artista.</p>
  </div>
{/if}

<style>
  .timeline-container {
    position: relative;
    width: 100%;
    padding: 10px 0px 60px 0px;
    background: var(--bg-primary);
    min-height: 500px;
    transition: background 0.3s ease;
    border-radius: 30px;
  }

  .timeline-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 80px;
    gap: 30px;
  }

  .timeline-slider {
    position: relative;
    width: 100%;
    overflow-x: auto;
    overflow-y: visible;
    scroll-behavior: smooth;
    padding: 100px 0; /* more headroom for line and cards */
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .timeline-slider::-webkit-scrollbar { display: none; }

  .timeline-track {
    position: relative;
    height: 340px;
    margin-top: 0;
    z-index: 2; /* dots above line, cards above dots */
  }

  /* Timeline line */
  .timeline-track::before {
    content: '';
    position: absolute;
    top: 120px; /* baseline for the line */
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, rgba(29,185,84,0.2), var(--accent-color), rgba(29,185,84,0.2));
    border-radius: 3px;
    box-shadow: 0 0 0 1px rgba(29,185,84,0.15), 0 6px 22px rgba(29,185,84,0.25);
    z-index: 0;
  }

  /* Explicit timeline dots aligned to albums */
  .timeline-dots {
    position: absolute;
    top: 114px; /* centers dot on 120px line */
    left: 0;
    right: 0;
    height: 24px;
    pointer-events: none;
    z-index: 1;
  }

  .timeline-dot {
    position: absolute;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: var(--bg-primary);
    border: 3px solid var(--accent-color);
    transform: translateX(-50%);
    box-shadow: 0 0 0 3px rgba(29, 185, 84, 0.18);
  }

  .timeline-dot.active {
    width: 16px;
    height: 16px;
    background: var(--accent-color);
    box-shadow: 0 0 0 6px rgba(29, 185, 84, 0.18), 0 0 18px rgba(29, 185, 84, 0.55);
    animation: dot-pulse 1.8s ease-out infinite;
  }

  @keyframes dot-pulse {
    0% { transform: translateX(-50%) scale(1); box-shadow: 0 0 0 6px rgba(29,185,84,0.18), 0 0 18px rgba(29,185,84,0.55); }
    60% { transform: translateX(-50%) scale(1.05); box-shadow: 0 0 0 10px rgba(29,185,84,0.12), 0 0 28px rgba(29,185,84,0.45); }
    100% { transform: translateX(-50%) scale(1); box-shadow: 0 0 0 6px rgba(29,185,84,0.18), 0 0 18px rgba(29,185,84,0.55); }
  }

  .error {
    text-align: center;
    padding: 80px;
    color: var(--error-color);
  }

  .error button {
    margin-top: 25px;
    padding: 15px 35px;
    background: var(--text-primary);
    color: var(--bg-primary);
    border: 2px solid var(--text-primary);
    border-radius: 30px;
    font-size: 1.1rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .error button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  .no-albums {
    text-align: center;
    padding: 80px;
    color: var(--text-tertiary);
    font-size: 1.3rem;
    transition: color 0.3s ease;
  }

  @media (max-width: 1024px) {
    .timeline-wrapper {
      padding: 0 40px;
    }

    .timeline-container {
      padding: 10px 0px 40px 0px;
    }
  }

  @media (max-width: 768px) {
    .timeline-container {
      padding: 10px 0px 30px 0px;
      border-radius: 20px;
    }

    .timeline-wrapper {
      padding: 0 16px;
      gap: 12px;
    }

    .timeline-slider {
      padding: 60px 0;
    }

    .timeline-track {
      height: 250px;
    }

    /* Adjust timeline line for mobile */
    .timeline-track::before {
      top: 70px;
      height: 2px;
    }

    .timeline-track::after {
      top: 65px;
      height: 12px;
    }
  }

  @media (max-width: 480px) {
    .timeline-wrapper {
      padding: 0 12px;
      gap: 8px;
    }

    .timeline-slider {
      padding: 50px 0;
    }

    .timeline-track {
      height: 220px;
    }

    .timeline-track::before {
      top: 60px;
    }

    .timeline-track::after {
      top: 55px;
      height: 10px;
    }
  }
</style>
