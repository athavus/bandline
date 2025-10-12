<script lang="ts">
  import { onMount } from "svelte";
  import SearchInput from "./components/SearchInput.svelte";
  import ArtistList from "./components/ArtistList.svelte";
  import ArtistDetails from "./components/ArtistDetails.svelte";
  import Timeline from "./components/Timeline.svelte";
  import Loading from "./components/Loading.svelte";
  import ThemeButton from "./components/ThemeButton.svelte";
  import Modal from "./components/Modal.svelte";
  import Sidebar from "./components/Sidebar.svelte";
  import AuthModal from "./components/AuthModal.svelte";
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
    console.log("Ação da sidebar:", action);
  }

  function handleAuthModalClose() {
    showAuthModal = false;
  }

  function handleLoginSuccess() {
    showAuthModal = false;
    // Se havia uma pesquisa pendente, executá-la após o login
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
    </div>

    <!-- Indicador de usuário logado -->
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

  <!-- Mensagem de boas-vindas para usuários não autenticados -->
  {#if !authState.isAuthenticated}
    <div class="welcome-section">
      <h2>Descubra seus artistas favoritos</h2>
      <p>
        Faça login ou crie uma conta para acessar nossa plataforma de descoberta
        musical
      </p>
      <div class="welcome-buttons">
        <button
          class="primary-btn"
          on:click={() => {
            showAuthModal = true;
            authMode = "login";
          }}
        >
          Fazer Login
        </button>
        <button
          class="secondary-btn"
          on:click={() => {
            showAuthModal = true;
            authMode = "register";
          }}
        >
          Criar Conta
        </button>
      </div>
    </div>
  {:else if loading}
    <Loading message="Carregando dados do artista..." />
  {:else if selectedArtist}
    <div class="actions">
      <button class="details-btn" on:click={openDetailsModal}>
        <svg width="20" height="20" viewBox="0 0 512 512">
          <g fill="currentColor">
            <path
              d="M426.666667,1.42108547e-14 L426.666667,341.333333 L3.55271368e-14,341.333333 L3.55271368e-14,1.42108547e-14 L426.666667,1.42108547e-14 Z M384,42.6666667 L42.6666667,42.6666667 L42.6666667,298.666667 L384,298.666667 L384,42.6666667 Z M341.333333,213.333333 L341.333333,245.333333 L234.666667,245.333333 L234.666667,213.333333 L341.333333,213.333333 Z M341.333333,149.333333 L341.333333,181.333333 L234.666667,181.333333 L234.666667,149.333333 L341.333333,149.333333 Z M192,85.3333333 L192,170.666667 L85.3333333,170.666667 L85.3333333,85.3333333 L192,85.3333333 Z M341.333333,85.3333333 L341.333333,117.333333 L234.666667,117.333333 L234.666667,85.3333333 L341.333333,85.3333333 Z"
              transform="translate(42.666667, 85.333333)"
            ></path>
          </g>
        </svg>
        Detalhes do Artista
      </button>
      <Timeline artistId={selectedArtist.id} on:back={handleBackToArtist} />
    </div>
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

<!-- Modal de Autenticação -->
<AuthModal
  bind:open={showAuthModal}
  {authMode}
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
    padding: 40px 24px;
  }

  .welcome-section {
    text-align: center;
    max-width: 600px;
    margin: 40px auto;
    padding: 40px 24px;
    background: var(--bg-card);
    border-radius: 16px;
    border: 1px solid var(--border-color);
    box-shadow: var(--shadow-lg);
  }

  .welcome-section h2 {
    color: var(--text-primary);
    font-family: var(--font-heading);
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0 0 20px 0;
  }

  .welcome-section p {
    color: var(--text-secondary);
    font-family: var(--font-primary);
    font-size: 1.1rem;
    line-height: 1.6;
    margin: 0 0 32px 0;
  }

  .welcome-buttons {
    display: flex;
    gap: 16px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .primary-btn,
  .secondary-btn {
    padding: 14px 32px;
    border-radius: 8px;
    font-family: var(--font-primary);
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 1px solid;
  }

  .primary-btn {
    background: var(--accent-color);
    border-color: var(--accent-color);
    color: white;
    box-shadow: var(--shadow-sm);
  }

  .primary-btn:hover {
    background: var(--accent-hover);
    border-color: var(--accent-hover);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  .secondary-btn {
    background: transparent;
    border-color: var(--border-color);
    color: var(--text-primary);
  }

  .secondary-btn:hover {
    border-color: var(--accent-color);
    background: var(--bg-hover);
    transform: translateY(-1px);
    box-shadow: var(--shadow-sm);
  }

  .actions {
    margin-top: 20px;
    text-align: center;
    padding: 0 24px;
  }

  .details-btn {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 16px 28px;
    background: var(--accent-color);
    border: none;
    border-radius: 8px;
    color: white;
    cursor: pointer;
    font-family: var(--font-primary);
    font-size: 0.95rem;
    font-weight: 600;
    transition: all 0.3s ease;
    margin: 20px 0px 0px 0px;
    box-shadow: var(--shadow-sm);
  }

  .details-btn:hover {
    background: var(--accent-hover);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  .details-btn svg {
    width: 20px;
    height: 20px;
    transition: transform 0.3s ease;
  }

  .details-btn:hover svg {
    transform: scale(1.1);
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
      padding: 30px 20px;
    }

    .welcome-section {
      margin: 30px 20px;
      padding: 30px 20px;
      border-radius: 12px;
    }

    .welcome-section h2 {
      font-size: 2rem;
    }

    .welcome-section p {
      font-size: 1rem;
    }

    .welcome-buttons {
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }

    .primary-btn,
    .secondary-btn {
      width: 100%;
      max-width: 280px;
      padding: 12px 24px;
    }

    .details-btn {
      padding: 14px 24px;
      font-size: 0.9rem;
    }

    .actions {
      padding: 0 20px;
    }
  }

  @media (max-width: 480px) {
    .app-header {
      padding: 12px 16px;
    }

    .welcome-section {
      margin: 20px 16px;
      padding: 24px 16px;
    }

    .welcome-section h2 {
      font-size: 1.8rem;
    }

    .welcome-section p {
      font-size: 0.95rem;
    }

    .primary-btn,
    .secondary-btn {
      padding: 12px 20px;
      font-size: 0.9rem;
    }

    .search-container {
      padding: 24px 16px;
    }

    .actions {
      padding: 0 16px;
    }
  }
</style>
