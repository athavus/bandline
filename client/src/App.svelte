<script lang="ts">
  import { searchArtists, getArtistData } from "./lib/data.ts";
  
  let query = '';
  let artists = [];
  let selectedArtist = null;
  let artistData = null;
  let showOverlay = false;
  let loading = false;

  async function handleInput() {
    const result = await searchArtists(query);
    artists = result.artists || [];
    showOverlay = artists.length > 0;
  }

  async function selectArtist(artist: any) {
    selectedArtist = artist;
    query = artist.name;
    showOverlay = false;
    loading = true;
    artistData = null;
    try {
      artistData = await getArtistData(artist.id); 
    } catch (error) {
      console.error('Erro ao buscar dados do artista:', error);
    } finally {
      loading = false;
    }
  }

  function handleFocus() {
    if (artists.length > 0) {
      showOverlay = true;
    }
  }

  function handleBlur() {
    setTimeout(() => {
      showOverlay = false;
    }, 200);
  }
</script>

<main>
  <div class="search-container">
    <input 
      bind:value={query}
      on:input={handleInput}
      on:focus={handleFocus}
      on:blur={handleBlur}
      type="text" 
      placeholder="Digite o nome do artista" 
    />

    {#if showOverlay}
      <div class="overlay">
        {#each artists as artist}
          <button
            class="artist-item"
            on:click={() => selectArtist(artist)}
            type="button"
          >
            {#if artist.image}
              <img src={artist.image} alt={artist.name} />
            {:else}
              <div class="no-image">?</div>
            {/if}
            <div class="artist-info">
              <div class="artist-name">{artist.name}</div>
              <div class="artist-details">
                {artist.total_followers.toLocaleString('pt-BR')} seguidores
                {#if artist.genres.length > 0}
                  • {artist.genres.join(', ')}
                {/if}
              </div>
            </div>
          </button>
        {/each}
      </div>
    {/if}
  </div>

  {#if loading}
    <p>Carregando dados do artista...</p>
  {:else if artistData}
    <div class="artist-data">
      <p>ID do artista: {artistData.id}</p>
      <p>Nome do Artista: {artistData.name}</p>
      <p>Número de Seguidores: {artistData.total_followers.toLocaleString('pt-BR')}</p>
      {#if artistData.genres.length > 0}
        <p>Gêneros: {artistData.genres.join(', ')}</p>
      {/if}
      {#if artistData.image}
        <img src={artistData.image} alt={artistData.name} width="200" />
      {/if}
    </div>
  {/if}
</main>

<style>
  .search-container {
    position: relative;
    width: 100%;
    max-width: 500px;
  }

  input {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  .overlay {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-top: 5px;
    max-height: 300px;
    overflow-y: auto;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    z-index: 1000;
  }

  .artist-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    width: 100%;
    border: none;
    background: white;
    cursor: pointer;
    text-align: left;
  }

  .artist-item:hover {
    background: #f5f5f5;
  }

  .artist-item img,
  .no-image {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
  }

  .no-image {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ddd;
    font-size: 24px;
  }

  .artist-info {
    flex: 1;
  }

  .artist-name {
    font-weight: 600;
    margin-bottom: 3px;
  }

  .artist-details {
    font-size: 14px;
    color: #666;
  }

  .artist-data {
    margin-top: 20px;
  }
</style>
