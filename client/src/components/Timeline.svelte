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
    <h2 class="timeline-title">DISCOGRAFIA</h2>
    <div class="timeline-wrapper">
      <button class="nav-button prev" on:click={() => scroll(-400)} aria-label="Anterior">
        <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      <div class="timeline-slider" bind:this={sliderElement}>
        <div class="timeline-line"></div>
        <div class="timeline-track" style="width: {getTotalWidth()}px">
          {#each albums.items as album, i (album.id)}
            <div
              class="album-item {selectedAlbum?.id === album.id ? 'active' : ''}"
              style="left: {getTimelineX(i) - 90}px"
              on:click={() => handleAlbumClick(album)}
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
    padding: 60px 0;
    background: linear-gradient(180deg,#fff 0%,#f8f9fa 100%);
    min-height: 500px;
  }

  .timeline-title {
    text-align: center;
    font-size: 3.5rem;
    font-weight: 900;
    background: linear-gradient(135deg,#1a1a1a 0%,#4a4a4a 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 4rem;
    letter-spacing: -2px;
    text-transform: uppercase;
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
    width: 60px; height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg,#1a1a1a 0%,#2a2a2a 100%);
    border: none; color: #fff;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: transform .3s ease, box-shadow .3s ease;
    box-shadow: 0 8px 25px rgba(0,0,0,.2);
    z-index: 5;
  }
  .nav-button.prev { left: 0 }
  .nav-button.next { right: 0 }
  .nav-button:hover {
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 12px 35px rgba(0,0,0,.3);
  }

  .timeline-slider {
    position: relative;
    width: 100%;
    overflow-x: auto; overflow-y: visible;
    scroll-behavior: smooth;
    padding: 80px 0;
    scrollbar-width: none; -ms-overflow-style: none;
  }
  .timeline-slider::-webkit-scrollbar { display: none }

  /* Linha centralizada no meio das capas dos álbuns */
  .timeline-line {
    position: absolute;
    top: 165px; /* Ajustado para ficar no centro das capas (85px de altura da capa = 170/2) */
    left: 0;
    width: 100%;
    height: 4px;
    background: rgba(26,26,26,.2);
    border-radius: 2px;
    z-index: 1;
  }

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
    transition: transform .4s cubic-bezier(.4,0,.2,1);
    z-index: 3;
  }
  .album-item:hover,
  .album-item.active { transform: translateY(-15px) scale(1.08) }

  .album-cover {
    width: 170px; height: 170px;
    border-radius: 20px;
    background: linear-gradient(135deg,#f5f5f5 0%,#e8e8e8 100%);
    box-shadow: 0 10px 30px rgba(0,0,0,.12),0 2px 8px rgba(0,0,0,.08);
    margin-bottom: 20px;
    overflow: hidden;
    transition: transform .4s cubic-bezier(.4,0,.2,1), box-shadow .4s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .album-item:hover .album-cover img {
    transform: scale(1.15);
  }
  .album-cover img {
    width: 100%; height: 100%; object-fit: cover;
    transition: transform .4s ease;
  }
  .no-image {
    font-size: 3rem;
    color: #999;
    font-weight: 900;
  }

  .album-details {
    text-align: center; width: 150px;
  }
  .album-name {
    font-size: 1.1rem; font-weight: 800;
    color: #1a1a1a; margin: 0 0 8px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .album-year { font-size: .95rem; color: #666; margin: 0 0 10px; font-weight: 600 }
  .album-badge {
    font-size: .75rem; font-weight: 700;
    background: linear-gradient(135deg,#1a1a1a 0%,#333 100%);
    color: #fff; border-radius: 20px; padding: 6px 14px;
    text-transform: uppercase; letter-spacing:.5px;
    box-shadow: 0 2px 8px rgba(0,0,0,.15);
    display: inline-block;
  }

  /* Efeito de ruído corrigido */
  @keyframes noise {
    0% { background: rgba(26,26,26,.2); }
    5% { background: linear-gradient(90deg, rgba(26,26,26,.2) 0%, rgba(255,255,255,.4) 10%, rgba(26,26,26,.2) 20%); }
    15% { background: rgba(26,26,26,.2); }
    25% { background: linear-gradient(90deg, rgba(26,26,26,.2) 30%, rgba(255,255,255,.3) 40%, rgba(26,26,26,.2) 50%); }
    35% { background: rgba(26,26,26,.2); }
    45% { background: linear-gradient(90deg, rgba(26,26,26,.2) 60%, rgba(255,255,255,.5) 70%, rgba(26,26,26,.2) 80%); }
    55% { background: rgba(26,26,26,.2); }
    65% { background: linear-gradient(90deg, rgba(26,26,26,.2) 20%, rgba(255,255,255,.2) 30%, rgba(26,26,26,.2) 40%); }
    75% { background: rgba(26,26,26,.2); }
    85% { background: linear-gradient(90deg, rgba(26,26,26,.2) 50%, rgba(255,255,255,.4) 60%, rgba(26,26,26,.2) 70%); }
    100% { background: rgba(26,26,26,.2); }
  }
  .timeline-slider.noise .timeline-line {
    animation: noise 0.8s infinite ease-in-out;
  }

  /* Tracks Panel */
  .tracks-panel {
    margin: 60px 80px 0;
    background: #fff; border-radius: 30px;
    padding: 50px;
    box-shadow: 0 20px 60px rgba(0,0,0,.08);
    animation: slideUp .5s cubic-bezier(.4,0,.2,1);
  }
  @keyframes slideUp {
    from { opacity:0; transform:translateY(40px) }
    to { opacity:1; transform:translateY(0) }
  }
  .tracks-header {
    display:flex; justify-content:space-between; align-items:center;
    margin-bottom:35px; padding-bottom:25px; border-bottom:3px solid #f5f5f5
  }
  .tracks-header h3 { font-size:2rem; font-weight:900; margin:0; color:#1a1a1a }
  .close-btn {
    width:45px;height:45px;border-radius:50%;background:#f5f5f5;
    border:none;color:#666;font-size:1.4rem;cursor:pointer;
    display:flex;align-items:center;justify-content:center;
    transition:all .3s ease
  }
  .close-btn:hover { background:#1a1a1a;color:#fff;transform:rotate(90deg) }

  .tracks-grid {
    display:grid;grid-template-columns:repeat(auto-fill,minmax(350px,1fr));gap:16px
  }
  .track-card {
    display:flex;justify-content:space-between;align-items:center;
    padding:18px 24px;background:#f8f8f8;border-radius:15px;
    border-left:4px solid transparent;transition:all .3s ease
  }
  .track-card:hover { background:#f0f0f0;border-left-color:#1a1a1a;transform:translateX(8px) }
  .track-info { display:flex;align-items:center;gap:20px;flex:1;min-width:0 }
  .track-num {
    width:35px;height:35px;border-radius:50%;background:#e5e5e5;
    display:flex;align-items:center;justify-content:center;
    font-weight:900;color:#1a1a1a;font-size:1rem
  }
  .track-title { font-weight:600;color:#1a1a1a;font-size:1rem;
    white-space:nowrap;overflow:hidden;text-overflow:ellipsis
  }
  .track-time { font-family:'Courier New',monospace;color:#666;font-weight:700;font-size:1rem }

  /* Loaders, Errors, No Albums */
  .loading,.tracks-loading {
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    padding:80px;color:#1a1a1a
  }
  .tracks-loading { padding:50px }
  .loading-spinner {
    width:50px;height:50px;border:6px solid #e5e5e5;border-top:6px solid #1a1a1a;
    border-radius:50%;animation:spin 1s linear infinite;margin-bottom:25px
  }
  .loading-spinner.small {
    width:30px;height:30px;border-width:4px;margin-bottom:15px
  }
  @keyframes spin {0%{transform:rotate(0)}100%{transform:rotate(360deg)}}

  .error {
    text-align:center;padding:80px;color:#e74c3c
  }
  .error button {
    margin-top:25px;padding:15px 35px;
    background:linear-gradient(135deg,#1a1a1a 0%,#2a2a2a 100%);
    color:#fff;border:none;border-radius:30px;
    font-size:1.1rem;font-weight:700;cursor:pointer;
    box-shadow:0 8px 25px rgba(0,0,0,.2);transition:all .3s ease
  }
  .error button:hover { transform:translateY(-3px);box-shadow:0 12px 35px rgba(0,0,0,.3) }

  .no-albums {
    text-align:center;padding:80px;color:#999;font-size:1.3rem
  }

  @media (max-width:1024px) {
    .timeline-wrapper { padding:0 40px }
    .tracks-panel { margin:40px 20px 0;padding:30px }
    .timeline-title { font-size:2.5rem }
    .album-item { width:150px }
    .album-cover { width:140px;height:140px }
    .timeline-line { top: 150px; } /* Ajuste responsivo */
  }
  @media (max-width:768px) {
    .timeline-wrapper { padding:0 20px;gap:15px }
    .timeline-title { font-size:2rem;margin-bottom:2rem }
    .nav-button { width:50px;height:50px }
    .album-item { width:120px }
    .album-cover { width:110px;height:110px }
    .tracks-grid { grid-template-columns:1fr }
    .timeline-line { top: 135px; } /* Ajuste responsivo */
  }
</style>
