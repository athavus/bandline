<script lang="ts">
    import { onMount } from "svelte";
    import Header from "../components/Header.svelte";
    import Sidebar from "../components/Sidebar.svelte";
    import BrandTitle from "../components/titles/BrandTitle.svelte";
    import Loading from "../components/utils/Loading.svelte";
    import BrandSubtitle from "../components/titles/BrandSubtitle.svelte";
    import Icon from "@iconify/svelte";

    import type { SearchArtistResult, SpotifyArtist } from "../types/artist";
    import { auth } from "../lib/stores/auth";
    import { t } from "../lib/stores/language";
    import { setQueryParams } from "../lib/urlState";

    interface HistoryItem {
        id: number;
        artistId: string;
        artistName: string;
        artistAvatar?: string | null;
        searchedAt: string;
    }

    let query = "";
    let artists: SearchArtistResult[] = [];
    let selectedArtist: SpotifyArtist | null = null;
    let showTimeline = false;
    let sidebarOpen = false;
    let showAuthModal = false;
    let authMode: "login" | "register" = "login";
    let histories: HistoryItem[] = [];
    let loading = true;
    let error: string | null = null;
    let viewMode: "grid" | "list" = "grid";
    let searchQuery: string = "";

    const API_URL = import.meta.env.VITE_API_URL;

    $: authState = $auth;
    $: filteredHistories = histories.filter((history) =>
        history.artistName.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    onMount(async () => {
        if (!authState.isAuthenticated) {
            window.location.href = "/";
            return;
        }

        const savedViewMode = localStorage.getItem("historyViewMode");
        if (savedViewMode === "grid" || savedViewMode === "list") {
            viewMode = savedViewMode;
        }

        await fetchHistory();
    });

    async function fetchHistory() {
        loading = true;
        error = null;

        try {
            const response = await fetch(`${API_URL}/history`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            console.log("Status da resposta:", response.status);
            console.log("Headers:", response.headers);

            if (response.status === 401) {
                console.log("Não autenticado, redirecionando...");
                auth.logout();
                window.location.href = "/";
                return;
            }

            if (!response.ok) {
                const text = await response.text();
                console.error("Resposta não OK:", text);
                throw new Error(`Erro ao buscar histórico: ${response.status}`);
            }

            const contentType = response.headers.get("content-type");
            console.log("Content-Type:", contentType);

            if (!contentType || !contentType.includes("application/json")) {
                const text = await response.text();
                console.error("Resposta não é JSON:", text);
                throw new Error("Resposta inválida do servidor");
            }

            const data = await response.json();
            console.log("Dados recebidos:", data);
            histories = data.histories || [];
        } catch (err) {
            console.error("Erro ao buscar histórico:", err);
            error =
                "Não foi possível carregar o histórico. Verifique se está autenticado.";
        } finally {
            loading = false;
        }
    }

    function toggleSidebar() {
        sidebarOpen = !sidebarOpen;
    }

    function handleLogout() {
        auth.logout();
        selectedArtist = null;
        showTimeline = false;
        query = "";
        artists = [];
        setQueryParams({ artist: null, q: null });
        window.location.href = "/";
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
            handleLogout();
        }
        sidebarOpen = false;
    }

    function handleArtistClick(artistId: string, artistName: string) {
        setQueryParams({
            artist: artistId,
            q: artistName,
        });
        window.location.href = "/";
    }

    function formatDate(dateString: string): string {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "Agora";
        if (diffMins < 60) return `${diffMins} min atrás`;
        if (diffHours < 24) return `${diffHours}h atrás`;
        if (diffDays < 7) return `${diffDays}d atrás`;

        return date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    }

    function setViewMode(mode: "grid" | "list") {
        viewMode = mode;
        localStorage.setItem("historyViewMode", mode);
    }

    function handleClearSearch() {
        searchQuery = "";
    }
</script>

<Sidebar bind:open={sidebarOpen} on:action={handleSidebarAction} />

<main class:sidebar-open={sidebarOpen}>
    <Header
        bind:sidebarOpen
        on:toggleSidebar={toggleSidebar}
        on:logout={handleLogout}
    />

    <BrandSubtitle
        firstWord={t("firstHistoryWord")}
        secondWord={t("lastHistoryWord")}
    />

    <div class="history-container">
        {#if loading}
            <Loading message="Carregando histórico..." />
        {:else if error}
            <div class="error-message">
                <div class="error-icon-wrapper">
                    <Icon icon="mdi:alert-circle" width="64" height="64" />
                </div>
                <h3>Ops! Algo deu errado</h3>
                <p>{error}</p>
                <button on:click={fetchHistory} class="retry-button">
                    <Icon icon="mdi:refresh" width="20" height="20" />
                    Tentar Novamente
                </button>
            </div>
        {:else if histories.length === 0}
            <div class="empty-state">
                <div class="empty-icon-wrapper">
                    <Icon icon="mdi:music-note-off" width="80" height="80" />
                </div>
                <h3>Seu histórico está vazio</h3>
                <p>
                    Comece a explorar artistas e construa sua jornada musical!
                </p>
                <a href="/" class="explore-button">
                    <Icon icon="mdi:magnify" width="20" height="20" />
                    Descobrir Artistas
                </a>
            </div>
        {:else}
            <div class="history-header">
                <div class="history-stats">
                    <div class="stat-badge">
                        <Icon icon="mdi:music" width="20" height="20" />
                        <span
                            >{histories.length}
                            {histories.length === 1
                                ? "artista"
                                : "artistas"}</span
                        >
                    </div>
                </div>

                <div class="history-search-bar">
                    <Icon icon="mdi:magnify" width="20" height="20" />
                    <input
                        type="text"
                        bind:value={searchQuery}
                        placeholder="Pesquisar artistas..."
                        class="history-search-input"
                    />
                    {#if searchQuery}
                        <button
                            class="clear-search"
                            on:click={handleClearSearch}
                            title="Limpar busca"
                        >
                            <Icon icon="mdi:close" width="18" height="18" />
                        </button>
                    {/if}
                </div>

                <div class="view-controls">
                    <button
                        class="view-button"
                        class:active={viewMode === "grid"}
                        on:click={() => setViewMode("grid")}
                        title="Visualização em grid"
                    >
                        <Icon icon="mdi:view-grid" width="20" height="20" />
                    </button>
                    <button
                        class="view-button"
                        class:active={viewMode === "list"}
                        on:click={() => setViewMode("list")}
                        title="Visualização em lista"
                    >
                        <Icon icon="mdi:view-list" width="20" height="20" />
                    </button>
                </div>
            </div>

            {#if filteredHistories.length === 0}
                <div class="no-results">
                    <Icon
                        icon="mdi:alert-circle-outline"
                        width="48"
                        height="48"
                    />
                    <p>Nenhum artista encontrado com "{searchQuery}"</p>
                    <button
                        on:click={handleClearSearch}
                        class="clear-filter-button"
                    >
                        Limpar filtro
                    </button>
                </div>
            {:else}
                <div
                    class="history-content"
                    class:list-view={viewMode === "list"}
                >
                    {#each filteredHistories as history, index (history.id)}
                        <div
                            class="history-card"
                            on:click={() =>
                                handleArtistClick(
                                    history.artistId,
                                    history.artistName,
                                )}
                        >
                            <div class="card-rank">
                                <span class="rank-number">#{index + 1}</span>
                            </div>

                            <div class="card-image-wrapper">
                                {#if history.artistAvatar}
                                    <img
                                        src={history.artistAvatar}
                                        alt={history.artistName}
                                        class="artist-image"
                                    />
                                    <div class="image-overlay">
                                        <Icon
                                            icon="mdi:play-circle"
                                            width="48"
                                            height="48"
                                        />
                                    </div>
                                {:else}
                                    <div class="artist-image-placeholder">
                                        <span class="placeholder-letter"
                                            >{history.artistName
                                                .charAt(0)
                                                .toUpperCase()}</span
                                        >
                                        <div class="image-overlay">
                                            <Icon
                                                icon="mdi:play-circle"
                                                width="48"
                                                height="48"
                                            />
                                        </div>
                                    </div>
                                {/if}
                            </div>

                            <div class="card-content">
                                <h3 class="artist-name">
                                    {history.artistName}
                                </h3>
                                <div class="card-meta">
                                    <span class="meta-item">
                                        <Icon
                                            icon="mdi:clock-outline"
                                            width="14"
                                            height="14"
                                        />
                                        {formatDate(history.searchedAt)}
                                    </span>
                                </div>
                            </div>

                            <div class="card-action">
                                <Icon
                                    icon="mdi:arrow-right"
                                    width="24"
                                    height="24"
                                />
                            </div>
                        </div>
                    {/each}
                </div>
            {/if}
        {/if}
    </div>
</main>

<style>
    main {
        margin: 0 auto;
        padding: 0;
        transition: margin-left 0.3s ease;
        min-height: 100vh;
        background: var(--bg-gradient-primary);
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

    .history-container {
        max-width: 1400px;
        width: 100%;
        margin: 0 auto;
        padding: 40px 20px 80px;
    }

    .history-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        gap: 16px;
        flex-wrap: wrap;
    }

    .history-stats {
        display: flex;
        gap: 12px;
    }

    .stat-badge {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        background: var(--bg-secondary, #181818);
        border: 1px solid var(--border-color, #282828);
        border-radius: 6px;
        color: var(--text-secondary, #b3b3b3);
        font-weight: 500;
        font-size: 0.875rem;
    }

    .history-search-bar {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        background: var(--bg-secondary, #181818);
        border: 1px solid var(--border-color, #282828);
        border-radius: 6px;
        flex: 1;
        transition: border-color 0.2s ease;
    }

    .history-search-bar:focus-within {
        border-color: var(--text-secondary, #b3b3b3);
    }

    .history-search-bar :global(svg) {
        color: var(--text-secondary, #b3b3b3);
        flex-shrink: 0;
    }

    .history-search-input {
        flex: 1;
        background: transparent;
        border: none;
        outline: none;
        color: var(--text-primary, #ffffff);
        font-size: 0.875rem;
        font-family: inherit;
    }

    .history-search-input::placeholder {
        color: var(--text-secondary, #b3b3b3);
        opacity: 0.6;
    }

    .clear-search {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 4px;
        background: transparent;
        border: none;
        color: var(--text-secondary, #b3b3b3);
        cursor: pointer;
        border-radius: 4px;
        transition: all 0.2s ease;
    }

    .clear-search:hover {
        background: var(--bg-hover, #282828);
        color: var(--text-primary, #ffffff);
    }

    .view-controls {
        display: flex;
        gap: 8px;
    }

    .view-button {
        padding: 8px 12px;
        background: var(--bg-secondary, #181818);
        border: 1px solid var(--border-color, #282828);
        border-radius: 6px;
        color: var(--text-secondary, #b3b3b3);
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .view-button:hover {
        background: var(--bg-hover, #282828);
        border-color: var(--text-secondary, #b3b3b3);
    }

    .view-button.active {
        background: var(--accent-color, #1db954);
        border-color: var(--accent-color, #1db954);
        color: #ffffff;
    }

    .history-content {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 16px;
    }

    .history-content.list-view {
        grid-template-columns: 1fr;
        max-width: 900px;
        margin: 0 auto;
    }

    .history-card {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 16px;
        background: var(--bg-secondary, #181818);
        border: 1px solid var(--border-color, #282828);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .history-card:hover {
        background: var(--bg-hover, #282828);
        border-color: var(--text-secondary, #b3b3b3);
    }

    .card-rank {
        flex-shrink: 0;
    }

    .rank-number {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        font-weight: 600;
        font-size: 0.875rem;
        color: var(--text-secondary, #b3b3b3);
    }

    .card-image-wrapper {
        flex-shrink: 0;
    }

    .artist-image,
    .artist-image-placeholder {
        width: 64px;
        height: 64px;
        border-radius: 6px;
        transition: opacity 0.2s ease;
    }

    .artist-image {
        object-fit: cover;
    }

    .artist-image-placeholder {
        background: linear-gradient(135deg, #1db954, #1ed760);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .placeholder-letter {
        font-size: 1.5rem;
        font-weight: 700;
        color: #ffffff;
    }

    .image-overlay {
        display: none;
    }

    .card-content {
        flex: 1;
        min-width: 0;
    }

    .artist-name {
        font-size: 0.9375rem;
        font-weight: 600;
        color: var(--text-primary, #ffffff);
        margin: 0 0 6px 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .card-meta {
        display: flex;
        gap: 12px;
    }

    .meta-item {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 0.8125rem;
        color: var(--text-secondary, #b3b3b3);
    }

    .card-action {
        color: var(--text-secondary, #b3b3b3);
        opacity: 0;
        transition: opacity 0.2s ease;
    }

    .history-card:hover .card-action {
        opacity: 1;
    }

    /* List View Adjustments */
    .list-view .history-card {
        padding: 12px 16px;
    }

    .list-view .artist-image,
    .list-view .artist-image-placeholder {
        width: 56px;
        height: 56px;
    }

    .list-view .placeholder-letter {
        font-size: 1.25rem;
    }

    .error-message,
    .empty-state {
        text-align: center;
        margin: 80px auto;
        padding: 40px;
        max-width: 500px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
    }

    .error-icon-wrapper,
    .empty-icon-wrapper {
        margin-bottom: 8px;
        color: var(--text-secondary, #b3b3b3);
        opacity: 0.4;
    }

    .error-icon-wrapper {
        color: #ff4757;
        opacity: 0.6;
    }

    .error-message h3,
    .empty-state h3 {
        font-size: 1.25rem;
        color: var(--text-primary, #ffffff);
        margin: 0;
        font-weight: 600;
    }

    .error-message p,
    .empty-state p {
        font-size: 0.9375rem;
        margin: 0;
        color: var(--text-secondary, #b3b3b3);
        line-height: 1.5;
    }

    .retry-button,
    .explore-button {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: var(--accent-color, #1db954);
        color: white;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 6px;
        font-weight: 600;
        font-size: 0.9375rem;
        margin-top: 8px;
        transition: all 0.2s ease;
        border: none;
        cursor: pointer;
    }

    .retry-button:hover,
    .explore-button:hover {
        background: var(--accent-hover, #1ed760);
    }

    .no-results {
        text-align: center;
        padding: 60px 20px;
        color: var(--text-secondary, #b3b3b3);
    }

    .no-results :global(svg) {
        margin-bottom: 16px;
        opacity: 0.5;
    }

    .no-results p {
        font-size: 0.9375rem;
        margin: 0 0 16px 0;
    }

    .clear-filter-button {
        background: var(--bg-secondary, #181818);
        border: 1px solid var(--border-color, #282828);
        color: var(--text-primary, #ffffff);
        padding: 10px 20px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.875rem;
        font-weight: 500;
        transition: all 0.2s ease;
    }

    .clear-filter-button:hover {
        background: var(--bg-hover, #282828);
        border-color: var(--text-secondary, #b3b3b3);
    }

    @media (max-width: 768px) {
        main.sidebar-open {
            margin-left: 0;
            width: 100%;
            max-width: 100vw;
        }

        .history-container {
            padding: 30px 16px 60px;
        }

        .history-header {
            flex-direction: column;
            align-items: stretch;
            gap: 16px;
        }

        .history-stats {
            justify-content: center;
        }

        .history-search-bar {
            max-width: 100%;
            order: -1;
        }

        .view-controls {
            justify-content: center;
        }

        .history-content {
            grid-template-columns: 1fr;
        }

        .history-card {
            padding: 16px;
        }

        .rank-number {
            width: 36px;
            height: 36px;
            font-size: 0.85rem;
        }

        .artist-image,
        .artist-image-placeholder {
            width: 64px;
            height: 64px;
        }

        .placeholder-letter {
            font-size: 1.5rem;
        }

        .artist-name {
            font-size: 1rem;
        }

        .meta-item {
            font-size: 0.8rem;
        }

        .empty-state,
        .error-message {
            margin: 60px auto;
            padding: 40px 24px;
        }

        .empty-state h3,
        .error-message h3 {
            font-size: 1.5rem;
        }
    }

    @media (max-width: 480px) {
        .history-container {
            padding: 20px 12px 50px;
        }

        .history-card {
            padding: 14px;
            gap: 12px;
        }

        .rank-number {
            width: 32px;
            height: 32px;
            font-size: 0.8rem;
        }

        .artist-image,
        .artist-image-placeholder {
            width: 56px;
            height: 56px;
        }

        .placeholder-letter {
            font-size: 1.25rem;
        }

        .artist-name {
            font-size: 0.95rem;
        }

        .stat-badge {
            font-size: 0.85rem;
            padding: 8px 14px;
        }
    }
</style>
