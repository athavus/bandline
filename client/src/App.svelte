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
        <svg width="20" height="20" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
          <g fill="currentColor">
            <path d="M426.666667,1.42108547e-14 L426.666667,341.333333 L3.55271368e-14,341.333333 L3.55271368e-14,1.42108547e-14 L426.666667,1.42108547e-14 Z M384,42.6666667 L42.6666667,42.6666667 L42.6666667,298.666667 L384,298.666667 L384,42.6666667 Z M341.333333,213.333333 L341.333333,245.333333 L234.666667,245.333333 L234.666667,213.333333 L341.333333,213.333333 Z M341.333333,149.333333 L341.333333,181.333333 L234.666667,181.333333 L234.666667,149.333333 L341.333333,149.333333 Z M192,85.3333333 L192,170.666667 L85.3333333,170.666667 L85.3333333,85.3333333 L192,85.3333333 Z M341.333333,85.3333333 L341.333333,117.333333 L234.666667,117.333333 L234.666667,85.3333333 L341.333333,85.3333333 Z" transform="translate(42.666667, 85.333333)"></path>
          </g>
        </svg>
        Detalhes do Artista
      </button>
      <Timeline 
        artistId={selectedArtist.id} 
        on:back={handleBackToArtist}
      />
    </div>

    <Modal class="modal-artist-details" open={showModal} onClose={closeDetailsModal}>
      <ArtistDetails artist={selectedArtist} on:showTimeline={handleShowTimeline} />
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
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 12px 24px;
    background: transparent;
    border: 1.5px solid var(--bg-color, #ffffff91);
    border-radius: 8px;
    color: var(--bg-color, #fff);
    cursor: pointer;
    font-size: 0.95rem;
    font-weight: 500;
    transition: all 0.3s ease;
    margin: 20px 0px 0px 0px;
  }
  
  .details-btn svg {
    width: 20px;
    height: 20px;
    background: var(--text-color, #333);
    color: var(--bg-color, #fff);
    transition: transform 0.5s ease;
  }
  
  .details-btn:hover {
    transform: translateY(-1px);
  }
  
  .details-btn:active {
    transform: translateY(0);
  }
</style>
