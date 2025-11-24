<script lang="ts">
    import { onMount } from "svelte";
    import Header from "../components/Header.svelte";
    import Sidebar from "../components/Sidebar.svelte";
    import BrandSubtitle from "../components/titles/BrandSubtitle.svelte";
    import Loading from "../components/utils/Loading.svelte";

    // Componentes de Favoritos
    import FavoritesControls from "../components/favorites/FavoritesControls.svelte";
    import FavoritesGrid from "../components/favorites/FavoritesGrid.svelte";
    import FavoritesList from "../components/favorites/FavoritesList.svelte";
    import EmptyState from "../components/favorites/EmptyState.svelte";
    import ErrorState from "../components/favorites/ErrorState.svelte";
    import NoResults from "../components/favorites/NoResults.svelte";

    import { auth } from "../lib/stores/auth";
    import { t } from "../lib/stores/language";

    interface FavoriteAlbum {
        id: number;
        albumId: string;
        albumName: string;
        albumImage?: string;
        albumTracks: string;
        albumReleaseDate?: string;
        favoritedAt: string;
    }

    type SortOption = "recent" | "alphabetical" | "release" | "tracks";
    type ViewMode = "grid" | "list";

    let favorites: FavoriteAlbum[] = [];
    let filteredFavorites: FavoriteAlbum[] = [];
    let loading = true;
    let error: string | null = null;
    let sidebarOpen = false;
    let searchQuery = "";
    let sortBy: SortOption = "recent";
    let viewMode: ViewMode = "grid";

    const API_URL = import.meta.env.VITE_API_URL;
    $: authState = $auth;

    // Reativa: aplica filtro e ordenação sempre que mudar
    $: {
        filteredFavorites = filterAndSortFavorites(
            favorites,
            searchQuery,
            sortBy,
        );
    }

    onMount(async () => {
        if (!authState.isAuthenticated) {
            window.location.href = "/";
            return;
        }
        await fetchFavorites();
    });

    async function fetchFavorites() {
        loading = true;
        error = null;

        try {
            const response = await fetch(`${API_URL}/favorites`, {
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
                throw new Error(`Erro ao buscar favoritos: ${response.status}`);
            }

            const data = await response.json();
            favorites = data.favorites || [];
        } catch (err) {
            console.error("Erro ao buscar favoritos:", err);
            error =
                "Não foi possível carregar os favoritos. Verifique se está autenticado.";
        } finally {
            loading = false;
        }
    }

    function filterAndSortFavorites(
        albums: FavoriteAlbum[],
        query: string,
        sort: SortOption,
    ): FavoriteAlbum[] {
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
            case "release":
                filtered.sort((a, b) => {
                    const dateA = a.albumReleaseDate
                        ? new Date(a.albumReleaseDate).getTime()
                        : 0;
                    const dateB = b.albumReleaseDate
                        ? new Date(b.albumReleaseDate).getTime()
                        : 0;
                    return dateB - dateA;
                });
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
                        new Date(b.favoritedAt).getTime() -
                        new Date(a.favoritedAt).getTime(),
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

    async function removeFavorite(albumId: string) {
        try {
            const response = await fetch(`${API_URL}/favorites`, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ albumId }),
            });

            if (!response.ok) {
                throw new Error("Erro ao remover favorito");
            }

            await fetchFavorites();
        } catch (err) {
            console.error("Erro ao remover favorito:", err);
            alert("Erro ao remover favorito.");
        }
    }

    function openAlbumInSpotify(albumId: string) {
        window.open(`https://open.spotify.com/album/${albumId}`, "_blank");
    }

    function handleOpenSpotify(event: CustomEvent<string>) {
        openAlbumInSpotify(event.detail);
    }

    function handleRemove(event: CustomEvent<string>) {
        removeFavorite(event.detail);
    }
</script>

<Sidebar bind:open={sidebarOpen} on:action={handleSidebarAction} />

<main class:sidebar-open={sidebarOpen}>
    <Header bind:sidebarOpen on:toggleSidebar={toggleSidebar} />

    <BrandSubtitle
        firstWord={t("firstFavoritesWord")}
        secondWord={t("lastFavoritesWord")}
    />

    <div class="favorites-container">
        {#if loading}
            <Loading message={t("loadingFavorites")} />
        {:else if error}
            <ErrorState {error} on:retry={fetchFavorites} />
        {:else if favorites.length === 0}
            <EmptyState />
        {:else}
            <FavoritesControls
                totalFavorites={favorites.length}
                filteredCount={filteredFavorites.length}
                bind:searchQuery
                bind:sortBy
                bind:viewMode
            />

            {#if filteredFavorites.length === 0}
                <NoResults {searchQuery} />
            {:else if viewMode === "grid"}
                <FavoritesGrid
                    favorites={filteredFavorites}
                    on:openSpotify={handleOpenSpotify}
                    on:remove={handleRemove}
                />
            {:else}
                <FavoritesList
                    favorites={filteredFavorites}
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

    .favorites-container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 40px 20px;
    }

    @media (max-width: 768px) {
        .favorites-container {
            padding: 24px 16px;
        }
    }
</style>
