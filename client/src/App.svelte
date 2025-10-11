<script lang="ts">
  import SearchInput from "./components/SearchInput.svelte";
  import ArtistList from "./components/ArtistList.svelte";
  import ArtistDetails from "./components/ArtistDetails.svelte";
  import Timeline from "./components/Timeline.svelte";
  import Loading from "./components/Loading.svelte";
  import ThemeButton from "./components/ThemeButton.svelte";
  import Modal from "./components/Modal.svelte";
  import { searchArtists, getArtistData } from "./lib/data.ts";
  import type { SearchArtistResult, SpotifyArtist } from "./types/artist";
  
  let query = '';
  let artists: SearchArtistResult[] = [];
  let selectedArtist: SpotifyArtist | null = null;
  let showOverlay = false;
  let loading = false;
  let showTimeline = false;
  let showModal = false;

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
    showTimeline = false;

    try {
      selectedArtist = await getArtistData(artist.id);
    } catch (error) {
      console.error('Erro ao buscar dados do artista:', error);
    } finally {
      loading = false;
    }
  }

  function handleShowTimeline() {
    showTimeline = true;
  }

  function handleBackToArtist() {
    showTimeline = false;
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

  function openDetailsModal() {
    showModal = true;
  }

  function closeDetailsModal() {
    showModal = false;
  }
</script>

<main>
  <ThemeButton />

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
    <div class="actions">
      <button class="details-btn" on:click={openDetailsModal}>
        Ver detalhes do artista
      </button>
      <Timeline 
        artistId={selectedArtist.id} 
        on:back={handleBackToArtist}
      />
    </div>

    <Modal open={showModal} onClose={closeDetailsModal}>
      <ArtistDetails 
        artist={selectedArtist} 
        on:showTimeline={handleShowTimeline}
      />
    </Modal>
  {/if}
</main>

<style>
  main {
    margin: 0 auto;
    padding: 40px 20px;
  }

  .search-container {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .actions {
    margin-top: 20px;
    text-align: center;
  }

  .details-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 20px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  }
  .details-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }
  .details-btn:active {
    transform: translateY(0);
  }
</style>
