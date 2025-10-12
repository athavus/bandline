<script lang="ts">
  import { createEventDispatcher } from 'svelte';
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

  const dispatch = createEventDispatcher();

  function scroll(amount: number) {
    sliderElement?.scrollBy({ left: amount, behavior: 'smooth' });
  }

  async function loadAlbums() {
    if (!artistId) return;
    loading = true;
    error = null;
    albums = null;
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
    padding: 80px 0;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .timeline-slider::-webkit-scrollbar { display: none; }

  .timeline-track {
    position: relative;
    height: 300px;
    margin-top: 20px;
    z-index: 2;
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
  }

  @media (max-width: 768px) {
    .timeline-wrapper {
      padding: 0 20px;
      gap: 15px;
    }
  }
</style>
