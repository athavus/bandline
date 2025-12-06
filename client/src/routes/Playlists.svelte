<script lang="ts">
    import { onMount } from "svelte";
    import Header from "../components/Header.svelte";
    import Sidebar from "../components/Sidebar.svelte";
    import BrandSubtitle from "../components/titles/BrandSubtitle.svelte";
    import Loading from "../components/utils/Loading.svelte";

    // Componentes específicos de Playlists
    import PlaylistsControls from "../components/playlists/PlaylistsControls.svelte";
    import PlaylistsGrid from "../components/playlists/PlaylistsGrid.svelte";
    import PlaylistsList from "../components/playlists/PlaylistsList.svelte";
    import EmptyState from "../components/favorites/EmptyState.svelte";
    import ErrorState from "../components/favorites/ErrorState.svelte";
    import NoResults from "../components/favorites/NoResults.svelte";

    import { auth } from "../lib/stores/auth";
    import { t } from "../lib/stores/language";
    import { getQueryParam, setQueryParam } from "../lib/urlState";
    import { replace } from "../lib/router";

    interface CompletedAlbum {
        id: number;
        albumId: string;
        albumName: string;
        albumImage?: string;
        albumTracks: string;
        completedAt: string;
    }

    type SortOption = "recent" | "alphabetical" | "tracks";
    type ViewMode = "grid" | "list";

    let completedAlbums: CompletedAlbum[] = [];
    let filteredAlbums: CompletedAlbum[] = [];
    let loading = true;
    let error: string | null = null;
    let sidebarOpen = false;
    let searchQuery = "";
    let sortBy: SortOption = "recent";
    let viewMode: ViewMode = "grid";

    const API_URL = import.meta.env.VITE_API_URL;
    $: authState = $auth;

    let isInitialized = false;

    // Reativa: aplica filtro e ordenação sempre que mudar
    $: {
        filteredAlbums = filterAndSortAlbums(
            completedAlbums,
            searchQuery,
            sortBy,
        );
    }

    // Atualiza a URL quando o estado mudar (após inicialização)
    $: if (isInitialized && typeof window !== "undefined") {
        setQueryParam("playlistsSearch", searchQuery || null);
    }
    $: if (isInitialized && typeof window !== "undefined") {
        setQueryParam("playlistsSort", sortBy !== "recent" ? sortBy : null);
    }
    $: if (isInitialized && typeof window !== "undefined") {
        setQueryParam("playlistsView", viewMode !== "grid" ? viewMode : null);
    }

    onMount(async () => {
        // Aguarda a autenticação estar pronta
        await auth.checkAuth();

        // Usa $auth diretamente para garantir que está atualizado
        if (!$auth.isAuthenticated) {
            replace("/");
            return;
        }

        // Restaura o estado da URL
        const urlSearch = getQueryParam("playlistsSearch");
        const urlSort = getQueryParam("playlistsSort");
        const urlView = getQueryParam("playlistsView");

        if (urlSearch !== null) {
            searchQuery = urlSearch;
        }
        if (
            urlSort &&
            ["recent", "alphabetical", "tracks"].includes(urlSort)
        ) {
            sortBy = urlSort as SortOption;
        }
        if (urlView && (urlView === "grid" || urlView === "list")) {
            viewMode = urlView;
        }

        await fetchCompletedAlbums();

        // Marca como inicializado após restaurar o estado da URL
        isInitialized = true;

        // Listener para mudanças na URL (botão voltar/avançar)
        window.addEventListener("urlstatechange", handleURLStateChange);

        return () => {
            window.removeEventListener("urlstatechange", handleURLStateChange);
        };
    });

    function handleURLStateChange() {
        const urlSearch = getQueryParam("playlistsSearch");
        const urlSort = getQueryParam("playlistsSort");
        const urlView = getQueryParam("playlistsView");

        if (urlSearch !== null && urlSearch !== searchQuery) {
            searchQuery = urlSearch;
        }
        if (
            urlSort &&
            urlSort !== sortBy &&
            ["recent", "alphabetical", "tracks"].includes(urlSort)
        ) {
            sortBy = urlSort as SortOption;
        }
        if (
            urlView &&
            urlView !== viewMode &&
            (urlView === "grid" || urlView === "list")
        ) {
            viewMode = urlView;
        }
    }

    async function fetchCompletedAlbums() {
        loading = true;
        error = null;

        try {
            const response = await fetch(`${API_URL}/completedAlbums`, {
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
                throw new Error(`Erro ao buscar concluídos: ${response.status}`);
            }

            const data = await response.json();
            completedAlbums = data.completedAlbums || [];
        } catch (err) {
            console.error("Erro ao buscar concluídos:", err);
            error =
                "Não foi possível carregar os álbuns concluídos. Verifique se está autenticado.";
        } finally {
            loading = false;
        }
    }

    function filterAndSortAlbums(
        albums: CompletedAlbum[],
        query: string,
        sort: SortOption,
    ): CompletedAlbum[] {
        // Filtrar por busca
        let filtered = albums.filter((album) =>
            album.albumName.toLowerCase().includes(query.toLowerCase()),
        );

        // Ordenar
        switch (sort) {
            case "alphabetical":
                filtered.sort((a, b) =>
                    a.albumName.localeCompare(b.albumName, "pt-BR"),
                );
                break;
            case "tracks":
                filtered.sort((a, b) => {
                    const tracksA = parseInt(a.albumTracks) || 0;
                    const tracksB = parseInt(b.albumTracks) || 0;
                    return tracksB - tracksA;
                });
                break;
            case "recent":
            default:
                filtered.sort(
                    (a, b) =>
                        new Date(b.completedAt).getTime() -
                        new Date(a.completedAt).getTime(),
                );
                break;
        }

        return filtered;
    }

    function toggleSidebar() {
        sidebarOpen = !sidebarOpen;
    }

    function handleSidebarAction(event: CustomEvent<string>) {
        const action = event.detail;
        if (action === "logout") {
            auth.logout();
            window.location.href = "/";
        }
        sidebarOpen = false;
    }

    async function removeCompleted(albumId: string) {
        try {
            const response = await fetch(`${API_URL}/completedAlbums`, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ albumId }),
            });

            if (!response.ok) {
                throw new Error("Erro ao remover concluído");
            }

            await fetchCompletedAlbums();
        } catch (err) {
            console.error("Erro ao remover concluído:", err);
            alert("Erro ao remover álbum dos concluídos.");
        }
    }

    function openAlbumInSpotify(albumId: string) {
        window.open(`https://open.spotify.com/album/${albumId}`, "_blank");
    }

    function handleOpenSpotify(event: CustomEvent<string>) {
        openAlbumInSpotify(event.detail);
    }

    function handleRemove(event: CustomEvent<string>) {
        removeCompleted(event.detail);
    }
</script>

<Sidebar bind:open={sidebarOpen} on:action={handleSidebarAction} />

<main class:sidebar-open={sidebarOpen}>
    <Header bind:sidebarOpen on:toggleSidebar={toggleSidebar} />

    <BrandSubtitle
        firstWord={t("firstCompletedWord")}
        secondWord={t("lastCompletedWord")}
    />

    <div class="playlists-container">
        {#if loading}
            <Loading message={t("loadingCompleted")} />
        {:else if error}
            <ErrorState {error} on:retry={fetchCompletedAlbums} />
        {:else if completedAlbums.length === 0}
            <EmptyState />
        {:else}
            <PlaylistsControls
                totalAlbums={completedAlbums.length}
                filteredCount={filteredAlbums.length}
                bind:searchQuery
                bind:sortBy
                bind:viewMode
            />

            {#if filteredAlbums.length === 0}
                <NoResults {searchQuery} />
            {:else if viewMode === "grid"}
                <PlaylistsGrid
                    albums={filteredAlbums}
                    on:openSpotify={handleOpenSpotify}
                    on:remove={handleRemove}
                />
            {:else}
                <PlaylistsList
                    albums={filteredAlbums}
                    on:openSpotify={handleOpenSpotify}
                    on:remove={handleRemove}
                />
            {/if}
        {/if}
    </div>
</main>

<style>
    main {
        min-height: 100vh;
        background: var(--bg-gradient-primary);
        padding-bottom: 40px;
    }

    .playlists-container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 40px 20px;
    }

    @media (max-width: 768px) {
        .playlists-container {
            padding: 24px 16px;
        }
    }
</style>
