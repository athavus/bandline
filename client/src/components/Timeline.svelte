<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { SpotifyAlbums } from '../types/album.ts';
  import type { SpotifyAlbumTracks } from '../types/tracks.ts';

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

  function handleTrackClick(trackId: string) {
    window.open(`https://open.spotify.com/track/${trackId}`, '_blank');
  }

  function openAlbumInSpotify(e: Event, albumId: string) {
    e.stopPropagation();
    window.open(`https://open.spotify.com/album/${albumId}`, '_blank');
  }

  function formatDate(dateString: string) {
    const date = new Date(
      dateString.length === 4 ? `${dateString}-01-01` :
      dateString.length === 7 ? `${dateString}-01` :
      dateString
    );
    return date.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: dateString.length === 4 ? undefined : 'long',
      day: dateString.length > 7 ? 'numeric' : undefined
    });
  }

  function formatDuration(ms: number) {
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${m}:${s.toString().padStart(2, '0')}`;
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
  <div class="loading">
    <div class="loading-spinner"></div>
    <p>Carregando discografia...</p>
  </div>
{:else if error}
  <div class="error">
    <p>❌ Erro ao carregar discografia: {error}</p>
    <button on:click={loadAlbums}>Tentar novamente</button>
  </div>
{:else if albums?.items?.length}
  <div class="timeline-container">
    <div class="timeline-wrapper">
      <button class="nav-button prev" on:click={() => scroll(-400)} aria-label="Anterior">
        <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      <div class="timeline-slider" bind:this={sliderElement}>
        <div class="timeline-track" style="width: {getTotalWidth()}px">
          {#each albums.items as album, i (album.id)}
            <div
              class="album-item {selectedAlbum?.id === album.id ? 'active' : ''}"
              style="left: {getTimelineX(i) - 90}px"
              on:click={() => handleAlbumClick(album)}
              on:keypress={(e) => e.key === 'Enter' && handleAlbumClick(album)}
              role="button"
              tabindex="0"
            >
              <div class="album-cover">
                {#if album.images?.length}
                  <img src={album.images[0].url} alt={album.name} loading="lazy" />
                {:else}
                  <div class="no-image">♫</div>
                {/if}
                <button 
                  class="spotify-btn"
                  on:click={(e) => openAlbumInSpotify(e, album.id)}
                  aria-label="Abrir no Spotify"
                  title="Abrir no Spotify"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                  </svg>
                </button>
              </div>
              <div class="album-details">
                <h3 class="album-name">{album.name}</h3>
                <p class="album-year">{formatDate(album.release_date)}</p>
                <span class="album-badge">{album.total_tracks} faixas</span>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <button class="nav-button next" on:click={() => scroll(400)} aria-label="Próximo">
        <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>

    {#if selectedAlbum}
      <div class="tracks-panel">
        {#if tracksLoading}
          <div class="tracks-loading">
            <div class="loading-spinner small"></div>
            <p>Carregando faixas...</p>
          </div>
        {:else if albumTracks?.items}
          <div class="tracks-header">
            <h3>{selectedAlbum.name}</h3>
            <button class="close-btn" on:click={() => handleAlbumClick(selectedAlbum)}>✕</button>
          </div>
          <div class="tracks-grid">
            {#each albumTracks.items as track}
              <div 
                class="track-card"
                on:click={() => handleTrackClick(track.id)}
                on:keypress={(e) => e.key === 'Enter' && handleTrackClick(track.id)}
                role="button"
                tabindex="0"
              >
                <div class="track-info">
                  <span class="track-num">
                    <span class="track-number">{track.track_number}</span>
                    <svg class="track-spotify-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                    </svg>
                  </span>
                  <span class="track-title">{track.name}</span>
                </div>
                <span class="track-time">{formatDuration(track.duration_ms)}</span>
              </div>
            {/each}
          </div>
        {/if}
      </div>
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

  .nav-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: var(--bg-secondary);
    border: 2px solid var(--border-color);
    color: var(--text-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    z-index: 5;
  }

  .nav-button.prev { left: 0; }
  .nav-button.next { right: 0; }
  
  .nav-button:hover {
    transform: translateY(-50%) scale(1.05);
    background: var(--bg-hover);
    border-color: var(--text-primary);
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

  .album-item {
    position: absolute;
    top: 0;
    width: 180px;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 3;
  }

  .album-item:hover,
  .album-item.active {
    transform: translateY(-15px);
  }

  .album-cover {
    width: 170px;
    height: 170px;
    border-radius: 20px;
    background: var(--bg-secondary);
    border: 2px solid var(--border-color);
    margin-bottom: 20px;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .album-item:hover .album-cover {
    border-color: var(--text-primary);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }

  .album-item:hover .album-cover img {
    transform: scale(1.05);
  }

  .album-cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }

  .spotify-btn {
    position: absolute;
    bottom: 12px;
    right: 12px;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(30, 215, 96, 0.95);
    border: none;
    color: #000;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0;
    transform: scale(0.8);
    transition: all 0.3s ease;
    z-index: 10;
  }

  .spotify-btn svg {
    width: 20px;
    height: 20px;
  }

  .album-item:hover .spotify-btn {
    opacity: 1;
    transform: scale(1);
  }

  .spotify-btn:hover {
    background: rgb(30, 215, 96);
    transform: scale(1.1);
  }

  .no-image {
    font-size: 3rem;
    color: var(--text-tertiary);
    font-weight: 900;
    transition: color 0.3s ease;
  }

  .album-details {
    text-align: center;
    width: 150px;
  }

  .album-name {
    font-size: 1.1rem;
    font-weight: 800;
    color: var(--text-primary);
    margin: 0 0 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color 0.3s ease;
  }

  .album-year {
    font-size: 0.95rem;
    color: var(--text-secondary);
    margin: 0 0 10px;
    font-weight: 600;
    transition: color 0.3s ease;
  }

  .album-badge {
    font-size: 0.75rem;
    font-weight: 700;
    background: var(--bg-secondary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    border-radius: 20px;
    padding: 6px 14px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    display: inline-block;
    transition: all 0.3s ease;
  }

  .album-item:hover .album-badge {
    background: var(--text-primary);
    color: var(--bg-primary);
    border-color: var(--text-primary);
  }

  /* Tracks Panel */
  .tracks-panel {
    margin: 60px 80px 0;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 30px;
    padding: 50px;
    animation: slideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    transition: all 0.3s ease;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(40px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .tracks-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 35px;
    padding-bottom: 25px;
    border-bottom: 2px solid var(--border-color);
    transition: border-color 0.3s ease;
  }

  .tracks-header h3 {
    font-size: 2rem;
    font-weight: 900;
    margin: 0;
    color: var(--text-primary);
    transition: color 0.3s ease;
  }

  .close-btn {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    color: var(--text-secondary);
    font-size: 1.4rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  }

  .close-btn:hover {
    background: var(--text-primary);
    color: var(--bg-card);
    border-color: var(--text-primary);
    transform: rotate(90deg);
  }

  .tracks-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 16px;
  }

  .track-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18px 24px;
    background: var(--bg-secondary);
    border-radius: 15px;
    border: 1px solid transparent;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .track-card:hover {
    background: var(--bg-hover);
    border-color: var(--border-color);
    transform: translateX(8px);
  }

  .track-info {
    display: flex;
    align-items: center;
    gap: 20px;
    flex: 1;
    min-width: 0;
  }

  .track-num {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background: var(--bg-hover);
    border: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    color: var(--text-primary);
    font-size: 1rem;
    transition: all 0.3s ease;
    position: relative;
    flex-shrink: 0;
  }

  .track-number {
    position: absolute;
    transition: opacity 0.3s ease;
  }

  .track-spotify-icon {
    position: absolute;
    width: 18px;
    height: 18px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .track-card:hover .track-num {
    background: rgba(30, 215, 96, 0.95);
    color: #000;
    border-color: rgba(30, 215, 96, 0.95);
  }

  .track-card:hover .track-number {
    opacity: 0;
  }

  .track-card:hover .track-spotify-icon {
    opacity: 1;
  }

  .track-title {
    font-weight: 600;
    color: var(--text-primary);
    font-size: 1rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color 0.3s ease;
  }

  .track-time {
    font-family: 'Courier New', monospace;
    color: var(--text-secondary);
    font-weight: 700;
    font-size: 1rem;
    transition: color 0.3s ease;
  }

  /* Loaders, Errors, No Albums */
  .loading,
  .tracks-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px;
    color: var(--text-primary);
    transition: color 0.3s ease;
  }

  .tracks-loading {
    padding: 50px;
  }

  .loading-spinner {
    width: 50px;
    height: 50px;
    border: 4px solid var(--border-color);
    border-top: 4px solid var(--text-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 25px;
  }

  .loading-spinner.small {
    width: 30px;
    height: 30px;
    border-width: 3px;
    margin-bottom: 15px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .loading p,
  .tracks-loading p {
    color: var(--text-secondary);
    transition: color 0.3s ease;
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
    .tracks-panel {
      margin: 40px 20px 0;
      padding: 30px;
    }
    .album-item {
      width: 150px;
    }
    .album-cover {
      width: 140px;
      height: 140px;
    }
  }

  @media (max-width: 768px) {
    .timeline-wrapper {
      padding: 0 20px;
      gap: 15px;
    }
    .nav-button {
      width: 50px;
      height: 50px;
    }
    .album-item {
      width: 120px;
    }
    .album-cover {
      width: 110px;
      height: 110px;
    }
    .tracks-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
