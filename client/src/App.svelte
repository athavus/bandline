<script lang="ts">
  import { onMount } from "svelte";
  import SearchInput from "./components/SearchInput.svelte";
  import ArtistList from "./components/ArtistList.svelte";
  import ArtistDetails from "./components/ArtistDetails.svelte";
  import Timeline from "./components/Timeline.svelte";
  import Loading from "./components/Loading.svelte";
  import ThemeButton from "./components/ThemeButton.svelte";
  import ThemePaletteButton from "./components/ThemePaletteButton.svelte";
  import Modal from "./components/Modal.svelte";
  import Sidebar from "./components/Sidebar.svelte";
  import AuthModal from "./components/AuthModal.svelte";
  import ArtistHeaderBar from "./components/ArtistHeaderBar.svelte";
  import WelcomeSection from "./components/WelcomeSection.svelte";
  import BrandTitle from "./components/BrandTitle.svelte";
  import { searchArtists, getArtistData } from "./lib/data.ts";
  import { auth } from "./lib/stores/auth.ts";
  import type { SearchArtistResult, SpotifyArtist } from "./types/artist";

  let query = "";
  let artists: SearchArtistResult[] = [];
  let selectedArtist: SpotifyArtist | null = null;
  let showOverlay = false;
  let loading = false;
  let showTimeline = false;
  let showModal = false;
  let sidebarOpen = false;
  let showAuthModal = false;
  let authMode: "login" | "register" = "login";

  $: authState = $auth;

  onMount(async () => {
    await auth.checkAuth();
  });

  async function handleInput() {
    if (!authState.isAuthenticated) {
      showAuthModal = true;
      authMode = "login";
      return;
    }

    const result = await searchArtists(query);
    artists = result.artists || [];
    showOverlay = artists.length > 0;
  }

  async function handleSelectArtist(event: CustomEvent<SearchArtistResult>) {
    if (!authState.isAuthenticated) {
      showAuthModal = true;
      authMode = "login";
      return;
    }

    const artist = event.detail;
    query = artist.name;
    showOverlay = false;
    loading = true;
    selectedArtist = null;
    showTimeline = false;
    try {
      selectedArtist = await getArtistData(artist.id);
    } catch (error) {
      console.error("Erro ao buscar dados do artista:", error);
    } finally {
      loading = false;
    }
  }

  function handleShowTimeline() {
    if (!authState.isAuthenticated) {
      showAuthModal = true;
      authMode = "login";
      return;
    }
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
    if (!authState.isAuthenticated) {
      showAuthModal = true;
      authMode = "login";
      return;
    }
    showModal = true;
  }

  function closeDetailsModal() {
    showModal = false;
  }

  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
  }

  function handleSidebarAction(event: CustomEvent<string>) {
    const action = event.detail;

    if (action === "login") {
      showAuthModal = true;
      authMode = "login";
    } else if (action === "register") {
      showAuthModal = true;
      authMode = "register";
    } else if (action === "logout") {
      auth.logout();
      selectedArtist = null;
      showTimeline = false;
      query = "";
      artists = [];
    }

    sidebarOpen = false;
  }

  function handleAuthModalClose() {
    showAuthModal = false;
  }

  function handleLoginSuccess() {
    showAuthModal = false;

    if (query) {
      handleInput();
    }
  }
</script>

<Sidebar bind:open={sidebarOpen} on:action={handleSidebarAction} />

<main class:sidebar-open={sidebarOpen}>
  <header class="app-header">
    <div class="header-left">
      {#if !sidebarOpen}
        <button
          class="menu-toggle"
          on:click={toggleSidebar}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 12H21M3 6H21M3 18H21"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </button>
      {/if}
      <ThemeButton />
      <ThemePaletteButton />
    </div>

    {#if authState.isAuthenticated}
      <div class="user-indicator">
        <span class="user-welcome"
          >Olá, {authState.user?.username || "Usuário"}!</span
        >
        <button class="logout-btn" on:click={() => auth.logout()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <polyline
              points="16,17 21,12 16,7"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <line
              x1="21"
              y1="12"
              x2="9"
              y2="12"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    {/if}
  </header>

  {#if !selectedArtist && !loading}
    <BrandTitle />
  {/if}

  <div class="search-container">
    <SearchInput
      bind:value={query}
      on:input={handleInput}
      on:focus={handleFocus}
      on:blur={handleBlur}
      placeholder={authState.isAuthenticated
        ? "Buscar artistas..."
        : "Faça login para buscar artistas"}
      disabled={!authState.isAuthenticated}
    />
    <ArtistList {artists} show={showOverlay} on:select={handleSelectArtist} />
  </div>

  {#if !authState.isAuthenticated}
    <WelcomeSection
      onLogin={() => {
        showAuthModal = true;
        authMode = "login";
      }}
      onRegister={() => {
        showAuthModal = true;
        authMode = "register";
      }}
    />
  {:else if loading}
    <Loading message="Carregando dados do artista..." />
  {:else if selectedArtist}
    <ArtistHeaderBar
      name={selectedArtist.name}
      onDetailsClick={openDetailsModal}
    />
    <Timeline artistId={selectedArtist.id} on:back={handleBackToArtist} />
    <Modal
      class="modal-artist-details"
      open={showModal}
      onClose={closeDetailsModal}
    >
      <ArtistDetails
        artist={selectedArtist}
        on:showTimeline={handleShowTimeline}
      />
    </Modal>
  {/if}
</main>

<AuthModal
  bind:open={showAuthModal}
  bind:mode={authMode}
  on:close={handleAuthModalClose}
  on:loginSuccess={handleLoginSuccess}
/>

<style>
  main {
    margin: 0 auto;
    padding: 0;
    transition: margin-left 0.3s ease;
    min-height: 100vh;
    background: var(--bg-primary);
    display: flex;
    flex-direction: column;
  }

  main.sidebar-open {
    margin-left: 280px;
  }

  .app-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border-color);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .menu-toggle {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    color: var(--text-primary);
    box-shadow: var(--shadow-sm);
  }

  .menu-toggle:hover {
    background: var(--bg-hover);
    border-color: var(--accent-color);
    transform: scale(1.05);
  }

  .user-indicator {
    display: flex;
    align-items: center;
    gap: 12px;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 8px 16px;
    box-shadow: var(--shadow-sm);
  }

  .user-welcome {
    color: var(--text-primary);
    font-family: var(--font-primary);
    font-size: 0.9rem;
    font-weight: 500;
  }

  .logout-btn {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
  }

  .logout-btn:hover {
    color: var(--error-color);
    background: var(--bg-hover);
    transform: scale(1.1);
  }

  .search-container {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px 24px 40px;
  }

  @media (max-width: 768px) {
    main.sidebar-open {
      margin-left: 0;
    }

    .app-header {
      padding: 16px 20px;
    }

    .menu-toggle {
      width: 36px;
      height: 36px;
    }

    .user-indicator {
      padding: 6px 12px;
    }

    .search-container {
      padding: 16px 20px 30px;
    }
  }

  @media (max-width: 480px) {
    .app-header {
      padding: 12px 16px;
    }

    .search-container {
      padding: 12px 16px 24px;
    }
  }
</style>
