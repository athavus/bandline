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
    let viewMode: "single" | "double" = "double";

    const API_URL = import.meta.env.VITE_API_URL;

    $: authState = $auth;

    onMount(async () => {
        if (!authState.isAuthenticated) {
            window.location.href = "/";
            return;
        }

        const savedViewMode = localStorage.getItem("historyViewMode");
        if (savedViewMode === "single" || savedViewMode === "double") {
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

    function setViewMode(mode: "single" | "double") {
        viewMode = mode;
        localStorage.setItem("historyViewMode", mode);
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
                <Icon icon="mdi:alert-circle" width="48" height="48" />
                <p>{error}</p>
                <button on:click={fetchHistory} class="retry-button">
                    <Icon icon="mdi:refresh" width="20" height="20" />
                    Tentar Novamente
                </button>
            </div>
        {:else if histories.length === 0}
            <div class="empty-state">
                <Icon icon="mdi:history" width="64" height="64" />
                <h3>Nenhum histórico ainda</h3>
                <p>Pesquise artistas e seu histórico aparecerá aqui!</p>
                <a href="/" class="explore-button">
                    <Icon icon="mdi:magnify" width="20" height="20" />
                    Pesquisar Artistas
                </a>
            </div>
        {:else}
            <div class="view-controls">
                <button
                    class="view-button"
                    class:active={viewMode === "single"}
                    on:click={() => setViewMode("single")}
                    title="Visualização em uma coluna"
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <rect x="3" y="3" width="18" height="5" rx="1" />
                        <rect x="3" y="10" width="18" height="5" rx="1" />
                        <rect x="3" y="17" width="18" height="5" rx="1" />
                    </svg>
                </button>
                <button
                    class="view-button"
                    class:active={viewMode === "double"}
                    on:click={() => setViewMode("double")}
                    title="Visualização em duas colunas"
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <rect x="3" y="3" width="7" height="5" rx="1" />
                        <rect x="14" y="3" width="7" height="5" rx="1" />
                        <rect x="3" y="10" width="7" height="5" rx="1" />
                        <rect x="14" y="10" width="7" height="5" rx="1" />
                        <rect x="3" y="17" width="7" height="5" rx="1" />
                        <rect x="14" y="17" width="7" height="5" rx="1" />
                    </svg>
                </button>
            </div>
            <div
                class="history-grid"
                class:single-column={viewMode === "single"}
            >
                {#each histories as history, index (history.id)}
                    <div
                        class="history-card"
                        on:click={() =>
                            handleArtistClick(
                                history.artistId,
                                history.artistName,
                            )}
                    >
                        <div class="card-number">
                            #{index + 1}
                        </div>
                        <div class="card-image">
                            {#if history.artistAvatar}
                                <img
                                    src={history.artistAvatar}
                                    alt={history.artistName}
                                    class="artist-image"
                                />
                            {:else}
                                <div class="artist-image-placeholder">
                                    {history.artistName.charAt(0).toUpperCase()}
                                </div>
                            {/if}
                        </div>
                        <div class="card-info">
                            <div class="artist-name-card">
                                {history.artistName}
                            </div>
                            <div class="search-time">
                                {formatDate(history.searchedAt)}
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</main>

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

    .history-container {
        max-width: 1400px;
        width: 100%;
        margin: 0 auto;
        padding: 40px 20px;
    }

    .view-controls {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
        margin-bottom: 16px;
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

    .view-button svg {
        display: block;
    }

    .history-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0;
        background: var(--bg-secondary, #181818);
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid var(--border-color, #282828);
    }

    .history-grid.single-column {
        grid-template-columns: 1fr;
    }

    .history-card {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 12px 16px;
        background: transparent;
        cursor: pointer;
        transition: all 0.2s ease;
        min-height: 80px;
        border-bottom: 1px solid var(--border-color, #282828);
        border-right: 1px solid var(--border-color, #282828);
    }

    .history-card:hover {
        background: var(--bg-hover, #282828);
    }

    .history-card:nth-child(2n) {
        border-right: none;
    }

    .history-grid.single-column .history-card {
        border-right: none;
    }

    .history-card:nth-last-child(-n + 2) {
        border-bottom: none;
    }

    .history-grid.single-column .history-card:last-child {
        border-bottom: none;
    }

    .card-number {
        font-size: 1rem;
        font-weight: 600;
        color: var(--text-secondary, #b3b3b3);
        min-width: 32px;
        text-align: left;
    }

    .card-image {
        flex-shrink: 0;
    }

    .artist-image {
        width: 64px;
        height: 64px;
        border-radius: 4px;
        object-fit: cover;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    .artist-image-placeholder {
        width: 64px;
        height: 64px;
        border-radius: 4px;
        background: linear-gradient(135deg, #1db954, #1ed760);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        font-weight: 700;
        color: #ffffff;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    .card-info {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    .artist-name-card {
        font-size: 0.9375rem;
        font-weight: 500;
        color: var(--text-primary, #ffffff);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .search-time {
        font-size: 0.8125rem;
        color: var(--text-secondary, #b3b3b3);
        font-weight: 400;
    }

    .error-message {
        text-align: center;
        color: var(--text-secondary, #999);
        margin-top: 80px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
    }

    .error-message :global(svg) {
        color: #ff4757;
    }

    .error-message p {
        font-size: 1rem;
        margin: 0;
    }

    .retry-button {
        display: flex;
        align-items: center;
        gap: 8px;
        background: var(--accent-color, #1db954);
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 0.95rem;
        font-weight: 600;
        transition: all 0.3s ease;
    }

    .retry-button:hover {
        background: var(--accent-hover, #1ed760);
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(29, 185, 84, 0.4);
    }

    .empty-state {
        text-align: center;
        margin: 80px auto;
        padding: 60px 40px;
        max-width: 500px;
        background: rgba(255, 255, 255, 0.03);
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
    }

    .empty-state :global(svg) {
        color: rgba(255, 255, 255, 0.2);
        margin-bottom: 8px;
    }

    .empty-state h3 {
        font-size: 1.5rem;
        color: var(--text-primary, #fff);
        margin: 0;
        font-weight: 600;
    }

    .empty-state p {
        font-size: 1rem;
        margin: 0;
        color: var(--text-secondary, #999);
        line-height: 1.5;
    }

    .explore-button {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: var(--accent-color, #1db954);
        color: white;
        text-decoration: none;
        padding: 14px 28px;
        border-radius: 8px;
        font-weight: 600;
        font-size: 1rem;
        margin-top: 8px;
        transition: all 0.3s ease;
        border: none;
        cursor: pointer;
    }

    .explore-button:hover {
        background: var(--accent-hover, #1ed760);
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(29, 185, 84, 0.4);
    }

    @media (max-width: 768px) {
        main.sidebar-open {
            margin-left: 0;
        }

        .history-container {
            padding: 30px 16px;
        }

        .view-controls {
            justify-content: center;
        }

        .history-grid {
            grid-template-columns: 1fr;
        }

        .history-grid.single-column {
            grid-template-columns: 1fr;
        }

        .history-card {
            border-right: none;
        }

        .history-card:last-child {
            border-bottom: none;
        }

        .card-number {
            font-size: 0.875rem;
            min-width: 28px;
        }

        .artist-image,
        .artist-image-placeholder {
            width: 56px;
            height: 56px;
            font-size: 1.25rem;
        }

        .artist-name-card {
            font-size: 0.875rem;
        }

        .search-time {
            font-size: 0.75rem;
        }

        .empty-state {
            margin: 40px auto;
            padding: 40px 24px;
        }

        .empty-state h3 {
            font-size: 1.25rem;
        }

        .empty-state p {
            font-size: 0.9rem;
        }
    }

    @media (max-width: 480px) {
        .history-container {
            padding: 20px 12px;
        }

        .history-card {
            padding: 10px 12px;
            gap: 12px;
        }

        .card-number {
            font-size: 0.8125rem;
            min-width: 24px;
        }

        .artist-image,
        .artist-image-placeholder {
            width: 48px;
            height: 48px;
            font-size: 1.125rem;
        }

        .artist-name-card {
            font-size: 0.8125rem;
        }

        .search-time {
            font-size: 0.6875rem;
        }
    }
</style>
