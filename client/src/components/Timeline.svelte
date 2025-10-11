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
  
  const dispatch = createEventDispatcher();
  
  async function loadAlbums() {
    if (!artistId) {
      console.log('Timeline: artistId não definido');
      return;
    }
    
    console.log('Timeline: Carregando álbuns para artistId:', artistId);
    loading = true;
    error = null;
    albums = null;
    
    try {
      const response = await fetch(`http://localhost:3000/artistAlbums/${artistId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Timeline: Álbuns recebidos:', data);
      albums = data;
      
      if (!albums?.items || albums.items.length === 0) {
        console.log('Timeline: Nenhum álbum encontrado');
      }
    } catch (err) {
      console.error('Timeline: Erro ao carregar álbuns:', err);
      error = err instanceof Error ? err.message : 'Erro desconhecido';
    } finally {
      loading = false;
    }
  }
  
  async function loadAlbumTracks(albumId: string) {
    tracksLoading = true;
    try {
      const response = await fetch(`http://localhost:3000/albumTracks/${albumId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      albumTracks = data;
    } catch (error) {
      console.error('Erro ao carregar faixas:', error);
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
  
  function formatDate(dateString: string) {
    const date = new Date(dateString.length === 4 ? `${dateString}-01-01` : 
                         dateString.length === 7 ? `${dateString}-01` : dateString);
    return date.toLocaleDateString('pt-BR', { 
      year: 'numeric', 
      month: dateString.length === 4 ? undefined : 'long',
      day: dateString.length > 7 ? 'numeric' : undefined
    });
  }
  
  function formatDuration(ms: number) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
  
  // Reativo: carrega álbuns quando artistId mudar
  $: {
    console.log('Timeline: artistId mudou para:', artistId);
    if (artistId) {
      loadAlbums();
    }
  }
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
{:else if albums && albums.items && albums.items.length > 0}
  <div class="timeline-container">
    <h2 class="timeline-title">Discografia</h2>
    
    <div class="timeline">
      {#each albums.items as album, index}
        <div 
          class="timeline-item {index % 2 === 0 ? 'left' : 'right'} {selectedAlbum?.id === album.id ? 'active' : ''}"
          on:click={() => handleAlbumClick(album)}
          on:keydown={(e) => e.key === 'Enter' && handleAlbumClick(album)}
          role="button"
          tabindex="0"
        >
          <div class="timeline-marker">
            <div class="timeline-dot"></div>
          </div>
          
          <div class="timeline-content">
            <div class="album-card">
              <div class="album-image">
                {#if album.images && album.images.length > 0}
                  <img src={album.images[0].url} alt={album.name} />
                {:else}
                  <div class="no-image">♫</div>
                {/if}
              </div>
              
              <div class="album-info">
                <h3 class="album-title">{album.name}</h3>
                <p class="album-date">{formatDate(album.release_date)}</p>
                <p class="album-tracks">{album.total_tracks} faixas</p>
              </div>
            </div>
            
            {#if selectedAlbum?.id === album.id}
              <div class="tracks-container">
                {#if tracksLoading}
                  <div class="tracks-loading">
                    <div class="loading-spinner small"></div>
                    <p>Carregando faixas...</p>
                  </div>
                {:else if albumTracks}
                  <div class="tracks-list">
                    <h4>Faixas do álbum:</h4>
                    {#each albumTracks.items as track}
                      <div class="track-item">
                        <span class="track-number">{track.track_number}</span>
                        <span class="track-name">{track.name}</span>
                        <span class="track-duration">{formatDuration(track.duration_ms)}</span>
                      </div>
                    {/each}
                  </div>
                {/if}
              </div>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </div>
{:else if albums}
  <div class="no-albums">
    <p>Nenhum álbum encontrado para este artista.</p>
  </div>
{:else}
  <div class="no-albums">
    <p>Aguardando seleção de artista...</p>
  </div>
{/if}

<style>
  .timeline-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
  }
  
  .timeline-title {
    text-align: center;
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 3rem;
    color: #1a1a1a;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .timeline {
    position: relative;
    padding: 20px 0;
  }
  
  .timeline::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 4px;
    background: linear-gradient(to bottom, #667eea, #764ba2);
    transform: translateX(-50%);
    border-radius: 2px;
  }
  
  .timeline-item {
    position: relative;
    margin: 40px 0;
    display: flex;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .timeline-item:hover {
    transform: translateY(-2px);
  }
  
  .timeline-item.left {
    justify-content: flex-end;
    padding-right: calc(50% + 30px);
  }
  
  .timeline-item.right {
    justify-content: flex-start;
    padding-left: calc(50% + 30px);
  }
  
  .timeline-marker {
    position: absolute;
    left: 50%;
    top: 20px;
    transform: translateX(-50%);
    z-index: 2;
  }
  
  .timeline-dot {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: 4px solid white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }
  
  .timeline-item:hover .timeline-dot,
  .timeline-item.active .timeline-dot {
    transform: scale(1.3);
    box-shadow: 0 6px 12px rgba(102, 126, 234, 0.4);
  }
  
  .timeline-content {
    width: 100%;
    max-width: 500px;
  }
  
  .album-card {
    background: white;
    border-radius: 15px;
    padding: 20px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    display: flex;
    gap: 15px;
    align-items: center;
    transition: all 0.3s ease;
    border: 2px solid transparent;
  }
  
  .timeline-item:hover .album-card {
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
    border-color: #667eea;
  }
  
  .timeline-item.active .album-card {
    border-color: #667eea;
    background: linear-gradient(135deg, #f8f9ff 0%, #f0f2ff 100%);
  }
  
  .album-image {
    flex-shrink: 0;
    width: 80px;
    height: 80px;
    border-radius: 12px;
    overflow: hidden;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
  
  .album-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .no-image {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 2rem;
    font-weight: bold;
  }
  
  .album-info {
    flex: 1;
    min-width: 0;
  }
  
  .album-title {
    font-size: 1.2rem;
    font-weight: bold;
    margin: 0 0 5px 0;
    color: #1a1a1a;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .album-date {
    font-size: 0.9rem;
    color: #667eea;
    margin: 0 0 5px 0;
    font-weight: 600;
  }
  
  .album-tracks {
    font-size: 0.8rem;
    color: #666;
    margin: 0;
  }
  
  .tracks-container {
    margin-top: 20px;
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    border-left: 4px solid #667eea;
    animation: slideDown 0.3s ease;
  }
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .tracks-list h4 {
    margin: 0 0 15px 0;
    color: #1a1a1a;
    font-size: 1.1rem;
  }
  
  .track-item {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 8px 0;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .track-item:last-child {
    border-bottom: none;
  }
  
  .track-number {
    font-weight: bold;
    color: #667eea;
    min-width: 25px;
    text-align: center;
  }
  
  .track-name {
    flex: 1;
    color: #1a1a1a;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .track-duration {
    color: #666;
    font-size: 0.9rem;
    font-family: monospace;
  }
  
  .loading,
  .tracks-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
    color: #667eea;
  }
  
  .tracks-loading {
    padding: 20px;
  }
  
  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 15px;
  }
  
  .loading-spinner.small {
    width: 20px;
    height: 20px;
    border-width: 2px;
    margin-bottom: 10px;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .error {
    text-align: center;
    padding: 40px;
    color: #e74c3c;
  }
  
  .error button {
    margin-top: 15px;
    padding: 10px 20px;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
  }
  
  .error button:hover {
    background: #5568d3;
  }
  
  .no-albums {
    text-align: center;
    padding: 40px;
    color: #666;
    font-size: 1.1rem;
  }
  
  /* Responsividade */
  @media (max-width: 768px) {
    .timeline::before {
      left: 30px;
    }
    
    .timeline-item {
      padding-left: 70px !important;
      padding-right: 20px !important;
    }
    
    .timeline-item.left,
    .timeline-item.right {
      justify-content: flex-start;
    }
    
    .timeline-marker {
      left: 30px;
      transform: translateX(-50%);
    }
    
    .timeline-content {
      max-width: none;
    }
    
    .album-card {
      flex-direction: column;
      text-align: center;
    }
    
    .album-image {
      width: 120px;
      height: 120px;
    }
    
    .album-title {
      white-space: normal;
      overflow: visible;
      text-overflow: initial;
    }
    
    .timeline-title {
      font-size: 2rem;
    }
    
    .track-item {
      gap: 10px;
    }
    
    .track-name {
      font-size: 0.9rem;
    }
  }
  
  @media (max-width: 480px) {
    .timeline-container {
      padding: 20px 10px;
    }
    
    .timeline-title {
      font-size: 1.8rem;
      margin-bottom: 2rem;
    }
    
    .album-card {
      padding: 15px;
    }
    
    .tracks-container {
      padding: 15px;
    }
  }
</style>
