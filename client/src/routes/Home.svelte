<script lang="ts">
  import SearchInput from "../components/SearchInput.svelte";
  import ArtistList from "../components/artists/ArtistList.svelte";
  import ArtistDetails from "../components/artists/ArtistDetails.svelte";
  import Timeline from "../components/timeline/Timeline.svelte";
  import Loading from "../components/utils/Loading.svelte";
  import ThemeButton from "../components/utils/ThemeButton.svelte";
  import ThemePaletteButton from "../components/utils/ThemePaletteButton.svelte";
  import Sidebar from "../components/Sidebar.svelte";
  import AuthModal from "../components/AuthModal.svelte";
  import WelcomeSection from "../components/WelcomeSection.svelte";
  import BrandTitle from "../components/titles/BrandTitle.svelte";
  import LanguageSelector from "../components/utils/LanguageSelector.svelte";
  import { searchArtists, getArtistData } from "../lib/data";
  import { auth } from "../lib/stores/auth";
  import { t } from "../lib/stores/language";
  import { setQueryParams, getQueryParam } from "../lib/urlState";
  import type { SearchArtistResult, SpotifyArtist } from "../types/artist";

  let query = "";
  let artists: SearchArtistResult[] = [];
  let selectedArtist: SpotifyArtist | null = null;
  let showOverlay = false;
  let loading = false;
  let showTimeline = false;
  let sidebarOpen = false;
  let showAuthModal = false;
  let authMode: "login" | "register" = "login";
  $: authState = $auth;

  async function handleInput() {
    if (!authState.isAuthenticated) {
      showAuthModal = true;
      authMode = "login";
      return;
    }

    setQueryParams({ q: query || null });

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

    setQueryParams({
      artist: artist.id,
      q: artist.name,
    });

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

      setQueryParams({ artist: null, q: null });
    }

    sidebarOpen = false;
  }

  function handleAuthModalClose() {
    showAuthModal = false;
  }

  function handleLoginSuccess() {
    showAuthModal = false;

    const artistId = getQueryParam("artist");
    if (artistId) {
      loadArtistFromURL(artistId);
    } else if (query) {
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

    <div class="header-right">
      <LanguageSelector />
      {#if authState.isAuthenticated}
        <div class="user-indicator">
          <span class="user-welcome"
            >{t("hello")}, {authState.user?.username || t("user")}!</span
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
    </div>
  </header>
  <BrandTitle />
  <div class="search-container">
    <SearchInput
      bind:value={query}
      on:input={handleInput}
      on:focus={handleFocus}
      on:blur={handleBlur}
      placeholder={authState.isAuthenticated
        ? t("searchArtistsPlaceholder")
        : t("loginToSearch")}
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
    <Loading message={t("loading")} />
  {:else if selectedArtist}
    <ArtistDetails
      artist={selectedArtist}
      on:showTimeline={handleShowTimeline}
      on:selectRelatedArtist={handleSelectArtist}
    />
    <Timeline artistId={selectedArtist.id} on:back={handleBackToArtist} />
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
    width: 100%;
    max-width: 100vw;
    overflow-x: hidden;
  }

  main.sidebar-open {
    margin-left: 280px;
    width: calc(100% - 280px);
    max-width: calc(100vw - 280px);
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

  .header-right {
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
    padding: 20px 0px 40px;
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
