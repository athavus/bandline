<script lang="ts">
  import { searchArtists, getArtistData } from "./lib/data";
  import SearchInput from "./components/SearchInput.svelte";
  import ArtistList from "./components/ArtistList.svelte";
  import ArtistDetails from "./components/ArtistDetails.svelte";
  import Loading from "./components/Loading.svelte";
  import type { SearchArtistResult, SpotifyArtist } from "./types/artist";
  
  let query = '';
  let artists: SearchArtistResult[] = [];
  let selectedArtist: SpotifyArtist | null = null;
  let showOverlay = false;
  let loading = false;
  
  async function handleInput() {
    const result = await searchArtists(query);
    artists = result.artists || [];
    showOverlay = artists.length > 0;
  }
  
  async function handleSelectArtist(event: CustomEvent<SearchArtistResult>) {
    const artist = event.detail;
    query = artist.name;
    showOverlay = false;
    loading = true;
    selectedArtist = null;
    
    try {
      selectedArtist = await getArtistData(artist.id); 
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
    <SearchInput 
      bind:value={query}
      on:input={handleInput}
      on:focus={handleFocus}
      on:blur={handleBlur}
    />
    
    <ArtistList 
      {artists} 
      show={showOverlay}
      on:select={handleSelectArtist}
    />
  </div>
  
  {#if loading}
    <Loading message="Carregando dados do artista..." />
  {:else if selectedArtist}
    <ArtistDetails artist={selectedArtist} />
  {/if}
</main>

<style>
  main {
    max-width: 800px;
    margin: 0 auto;
    padding: 40px 20px;
  }
  
  .search-container {
    position: relative;
    width: 100%;
  }
</style>
