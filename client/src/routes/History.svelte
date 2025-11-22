<script lang="ts">
    import { onMount } from "svelte";
    import Header from "../components/Header.svelte";
    import Sidebar from "../components/Sidebar.svelte";
    import BrandTitle from "../components/titles/BrandTitle.svelte";
    import Loading from "../components/utils/Loading.svelte";
    import type { SearchArtistResult, SpotifyArtist } from "../types/artist";
    import { auth } from "../lib/stores/auth";
    import { t } from "../lib/stores/language";
    import { setQueryParams } from "../lib/urlState";
    interface HistoryItem {
        id: number;
        artistId: string;
        artistName: string;
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

    const API_URL = import.meta.env.VITE_API_URL;

    $: authState = $auth;

    onMount(async () => {
        if (!authState.isAuthenticated) {
            window.location.href = "/";
            return;
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
</script>

<Sidebar bind:open={sidebarOpen} on:action={handleSidebarAction} />

<main class:sidebar-open={sidebarOpen}>
    <Header
        bind:sidebarOpen
        on:toggleSidebar={toggleSidebar}
        on:logout={handleLogout}
    />

    <BrandTitle />

    <div class="history-container">
        <h1 class="history-title">Histórico de Pesquisas</h1>

        {#if loading}
            <Loading message="Carregando histórico..." />
        {:else if error}
            <div class="error-message">
                <p>{error}</p>
                <button on:click={fetchHistory} class="retry-button">
                    Tentar Novamente
                </button>
            </div>
        {:else if histories.length === 0}
            <div class="empty-state">
                <p>Você ainda não pesquisou nenhum artista.</p>
                <a href="/" class="home-link">Ir para Home</a>
            </div>
        {:else}
            <div class="table-wrapper">
                <table class="history-table">
                    <thead>
                        <tr>
                            <th>Artista</th>
                            <th>Data da Pesquisa</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each histories as history (history.id)}
                            <tr
                                class="history-row"
                                on:click={() =>
                                    handleArtistClick(
                                        history.artistId,
                                        history.artistName,
                                    )}
                            >
                                <td class="artist-name">{history.artistName}</td
                                >
                                <td class="search-date">
                                    {formatDate(history.searchedAt)}
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
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
        max-width: 1200px;
        width: 100%;
        margin: 0 auto;
        padding: 40px 20px;
    }

    .history-title {
        font-size: 2rem;
        font-weight: 700;
        color: var(--text-primary, #1db954);
        margin-bottom: 30px;
        text-align: center;
    }

    .table-wrapper {
        overflow-x: auto;
        background: var(--bg-secondary, #282828);
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    }

    .history-table {
        width: 100%;
        border-collapse: collapse;
        background: transparent;
    }

    .history-table thead {
        background: var(--bg-tertiary, #181818);
    }

    .history-table th {
        padding: 16px 20px;
        text-align: left;
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--text-secondary, #b3b3b3);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        border-bottom: 2px solid var(--border-color, #404040);
    }

    .history-table td {
        padding: 16px 20px;
        color: var(--text-primary, #ffffff);
        border-bottom: 1px solid var(--border-color, #404040);
    }

    .history-row {
        cursor: pointer;
        transition: background-color 0.2s ease;
    }

    .history-row:hover {
        background: var(--bg-hover, #3e3e3e);
    }

    .history-row:last-child td {
        border-bottom: none;
    }

    .artist-name {
        font-size: 1rem;
        font-weight: 500;
    }

    .search-date {
        font-size: 0.875rem;
        color: var(--text-secondary, #b3b3b3);
    }

    .error-message {
        text-align: center;
        padding: 40px 20px;
        color: var(--text-secondary, #b3b3b3);
    }

    .error-message p {
        font-size: 1.125rem;
        margin-bottom: 20px;
    }

    .retry-button {
        padding: 12px 24px;
        background: var(--accent-color, #1db954);
        color: #ffffff;
        border: none;
        border-radius: 24px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .retry-button:hover {
        background: var(--accent-hover, #1ed760);
        transform: scale(1.05);
    }

    .empty-state {
        text-align: center;
        padding: 60px 20px;
    }

    .empty-state p {
        font-size: 1.125rem;
        color: var(--text-secondary, #b3b3b3);
        margin-bottom: 24px;
    }

    .home-link {
        display: inline-block;
        padding: 12px 32px;
        background: var(--accent-color, #1db954);
        color: #ffffff;
        text-decoration: none;
        border-radius: 24px;
        font-size: 1rem;
        font-weight: 600;
        transition: all 0.2s ease;
    }

    .home-link:hover {
        background: var(--accent-hover, #1ed760);
        transform: scale(1.05);
    }

    @media (max-width: 768px) {
        main.sidebar-open {
            margin-left: 0;
        }

        .history-container {
            padding: 30px 16px;
        }

        .history-title {
            font-size: 1.5rem;
        }

        .history-table th,
        .history-table td {
            padding: 12px 16px;
        }

        .history-table th {
            font-size: 0.75rem;
        }

        .artist-name {
            font-size: 0.875rem;
        }

        .search-date {
            font-size: 0.75rem;
        }
    }

    @media (max-width: 480px) {
        .history-container {
            padding: 20px 12px;
        }

        .history-title {
            font-size: 1.25rem;
            margin-bottom: 20px;
        }

        .history-table th,
        .history-table td {
            padding: 10px 12px;
        }
    }
</style>
