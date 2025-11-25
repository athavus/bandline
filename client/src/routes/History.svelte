<script lang="ts">
    import { onMount } from "svelte";
    import Header from "../components/Header.svelte";
    import Sidebar from "../components/Sidebar.svelte";
    import BrandSubtitle from "../components/titles/BrandSubtitle.svelte";
    import Loading from "../components/utils/Loading.svelte";
    import {
        HistoryHeader,
        HistoryGrid,
        HistoryList,
        HistoryEmptyState,
        HistoryErrorState,
        HistoryNoResults,
    } from "../components/history";

    import type { HistoryItem } from "../types/history";
    import { auth } from "../lib/stores/auth";
    import { translations$ } from "../lib/stores/language";
    import { setQueryParams } from "../lib/urlState";

    let sidebarOpen = false;
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

            if (response.status === 401) {
                auth.logout();
                window.location.href = "/";
                return;
            }

            if (!response.ok) {
                throw new Error(`Erro ao buscar histórico: ${response.status}`);
            }

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Resposta inválida do servidor");
            }

            const data = await response.json();
            histories = data.histories || [];
        } catch (err) {
            console.error("Erro ao buscar histórico:", err);
            error = $translations$.errorLoadingHistory;
        } finally {
            loading = false;
        }
    }

    function toggleSidebar() {
        sidebarOpen = !sidebarOpen;
    }

    function handleLogout() {
        auth.logout();
        setQueryParams({ artist: null, q: null });
        window.location.href = "/";
    }

    function handleSidebarAction(event: CustomEvent<string>) {
        const action = event.detail;
        if (action === "logout") {
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

    function handleViewModeChange(mode: "grid" | "list") {
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
        firstWord={$translations$.firstHistoryWord}
        secondWord={$translations$.lastHistoryWord}
    />

    <div class="history-container">
        {#if loading}
            <Loading message={$translations$.loadingHistory} />
        {:else if error}
            <HistoryErrorState {error} onRetry={fetchHistory} />
        {:else if histories.length === 0}
            <HistoryEmptyState />
        {:else}
            <HistoryHeader
                totalArtists={histories.length}
                bind:searchQuery
                {viewMode}
                onClearSearch={handleClearSearch}
                onViewModeChange={handleViewModeChange}
            />

            {#if filteredHistories.length === 0}
                <HistoryNoResults
                    {searchQuery}
                    onClearFilter={handleClearSearch}
                />
            {:else if viewMode === "grid"}
                <HistoryGrid
                    histories={filteredHistories}
                    onArtistClick={handleArtistClick}
                />
            {:else}
                <HistoryList
                    histories={filteredHistories}
                    onArtistClick={handleArtistClick}
                />
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

    @media (max-width: 768px) {
        main.sidebar-open {
            margin-left: 0;
            width: 100%;
            max-width: 100vw;
        }

        .history-container {
            padding: 30px 16px 60px;
        }
    }

    @media (max-width: 480px) {
        .history-container {
            padding: 20px 12px 50px;
        }
    }
</style>
