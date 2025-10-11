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
      sliderElement.classList.remove('noise');
    } else {
      selectedAlbum = album;
      loadAlbumTracks(album.id);
      sliderElement.classList.add('noise');
    }
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
              <div class="track-card">
                <div class="track-info">
                  <span class="track-num">{track.track_number}</span>
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
    background: var(--gradient-bg);
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
    background: var(--gradient-dark);
    border: none;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    box-shadow: var(--shadow-lg);
    z-index: 5;
  }

  .nav-button.prev { left: 0; }
  .nav-button.next { right: 0; }
  
  .nav-button:hover {
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 12px 35px rgba(0,0,0,0.4);
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
    box-shadow: var(--shadow-lg);
    margin-bottom: 20px;
    overflow: hidden;
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .album-item:hover .album-cover {
    box-shadow: 0 15px 40px rgba(0,0,0,0.3);
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
    background: var(--gradient-dark);
    color: #fff;
    border-radius: 20px;
    padding: 6px 14px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    box-shadow: var(--shadow-sm);
    display: inline-block;
  }

  /* Tracks Panel */
  .tracks-panel {
    margin: 60px 80px 0;
    background: var(--bg-card);
    border-radius: 30px;
    padding: 50px;
    box-shadow: var(--shadow-lg);
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
    border-bottom: 3px solid var(--border-color);
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
    border: none;
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
    border-left: 4px solid transparent;
    transition: all 0.3s ease;
  }

  .track-card:hover {
    background: var(--bg-hover);
    border-left-color: var(--text-primary);
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
    background: var(--border-color);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    color: var(--text-primary);
    font-size: 1rem;
    transition: all 0.3s ease;
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
    border: 6px solid var(--border-color);
    border-top: 6px solid var(--accent-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 25px;
  }

  .loading-spinner.small {
    width: 30px;
    height: 30px;
    border-width: 4px;
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
    background: var(--gradient-dark);
    color: #fff;
    border: none;
    border-radius: 30px;
    font-size: 1.1rem;
    font-weight: 700;
    cursor: pointer;
    box-shadow: var(--shadow-lg);
    transition: all 0.3s ease;
  }

  .error button:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.4);
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
