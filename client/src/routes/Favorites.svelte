<script lang="ts">
    import { onMount } from "svelte";
    import Header from "../components/Header.svelte";
    import Sidebar from "../components/Sidebar.svelte";
    import BrandSubtitle from "../components/titles/BrandSubtitle.svelte";
    import Loading from "../components/utils/Loading.svelte";
    import Icon from "@iconify/svelte";

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

    function formatDate(dateString: string) {
        const date = new Date(dateString);
        return date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    }

    function clearSearch() {
        searchQuery = "";
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
            <div class="error-message">
                <Icon icon="mdi:alert-circle" width="48" height="48" />
                <p>{error}</p>
                <button on:click={fetchFavorites} class="retry-button">
                    <Icon icon="mdi:refresh" width="20" height="20" />
                    {t("retry") || "Tentar Novamente"}
                </button>
            </div>
        {:else if favorites.length === 0}
            <div class="empty-state">
                <Icon icon="mdi:heart-outline" width="64" height="64" />
                <h3>{t("noFavoritesYet") || "Nenhum favorito ainda"}</h3>
                <p>Explore álbuns e adicione seus favoritos aqui!</p>
                <a href="/home" class="explore-button">
                    <Icon icon="mdi:compass" width="20" height="20" />
                    Explorar Álbuns
                </a>
            </div>
        {:else}
            <!-- Barra de controles -->
            <div class="controls-bar">
                <div class="favorites-stats">
                    <Icon icon="mdi:heart" width="20" height="20" />
                    <span
                        >{filteredFavorites.length} de {favorites.length}
                        {favorites.length === 1 ? "álbum" : "álbuns"}</span
                    >
                </div>

                <div class="search-bar">
                    <Icon icon="mdi:magnify" width="20" height="20" />
                    <input
                        type="text"
                        bind:value={searchQuery}
                        placeholder="Pesquisar álbuns..."
                        class="favorites-search-input"
                    />
                    {#if searchQuery}
                        <button
                            class="clear-search"
                            on:click={clearSearch}
                            title="Limpar busca"
                        >
                            <Icon icon="mdi:close" width="18" height="18" />
                        </button>
                    {/if}
                </div>

                <div class="view-controls">
                    <div class="sort-dropdown">
                        <Icon icon="mdi:sort" width="18" height="18" />
                        <select bind:value={sortBy} class="sort-select">
                            <option value="recent">Mais Recentes</option>
                            <option value="alphabetical">A-Z</option>
                            <option value="release">Lançamento</option>
                            <option value="tracks">Mais Faixas</option>
                        </select>
                    </div>

                    <div class="view-mode-buttons">
                        <button
                            class="view-btn"
                            class:active={viewMode === "grid"}
                            on:click={() => (viewMode = "grid")}
                            title="Visualização em grade"
                        >
                            <Icon icon="mdi:grid" width="20" height="20" />
                        </button>
                        <button
                            class="view-btn"
                            class:active={viewMode === "list"}
                            on:click={() => (viewMode = "list")}
                            title="Visualização em lista"
                        >
                            <Icon
                                icon="mdi:format-list-bulleted"
                                width="20"
                                height="20"
                            />
                        </button>
                    </div>
                </div>
            </div>

            <!-- Lista de favoritos -->
            {#if filteredFavorites.length === 0}
                <div class="no-results">
                    <Icon icon="mdi:album" width="48" height="48" />
                    <p>Nenhum álbum encontrado com "{searchQuery}"</p>
                </div>
            {:else if viewMode === "grid"}
                <div class="favorites-grid">
                    {#each filteredFavorites as fav (fav.id)}
                        <div class="album-card">
                            <div class="album-cover">
                                {#if fav.albumImage}
                                    <img
                                        src={fav.albumImage}
                                        alt={fav.albumName}
                                        loading="lazy"
                                    />
                                {:else}
                                    <div class="no-image">
                                        <Icon
                                            icon="mdi:music-note"
                                            width="48"
                                            height="48"
                                        />
                                    </div>
                                {/if}
                                <div class="album-overlay">
                                    <button
                                        class="action-btn spotify-btn"
                                        on:click={() =>
                                            openAlbumInSpotify(fav.albumId)}
                                        title="Abrir no Spotify"
                                    >
                                        <Icon
                                            icon="mdi:spotify"
                                            width="24"
                                            height="24"
                                        />
                                    </button>
                                    <button
                                        class="action-btn remove-btn"
                                        on:click={() =>
                                            removeFavorite(fav.albumId)}
                                        title="Remover dos favoritos"
                                    >
                                        <Icon
                                            icon="mdi:heart-off"
                                            width="24"
                                            height="24"
                                        />
                                    </button>
                                </div>
                            </div>
                            <div class="album-info">
                                <h3 class="album-name">{fav.albumName}</h3>
                                <div class="album-meta">
                                    <span class="track-count">
                                        <Icon
                                            icon="mdi:music"
                                            width="14"
                                            height="14"
                                        />
                                        {fav.albumTracks} faixas
                                    </span>
                                    <span class="favorite-date">
                                        <Icon
                                            icon="mdi:calendar"
                                            width="14"
                                            height="14"
                                        />
                                        {formatDate(fav.favoritedAt)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            {:else}
                <div class="favorites-list">
                    {#each filteredFavorites as fav (fav.id)}
                        <div class="album-list-item">
                            <div class="list-item-cover">
                                {#if fav.albumImage}
                                    <img
                                        src={fav.albumImage}
                                        alt={fav.albumName}
                                        loading="lazy"
                                    />
                                {:else}
                                    <div class="no-image-list">
                                        <Icon
                                            icon="mdi:music-note"
                                            width="24"
                                            height="24"
                                        />
                                    </div>
                                {/if}
                            </div>

                            <div class="list-item-info">
                                <h3 class="list-album-name">
                                    {fav.albumName}
                                </h3>
                                <div class="list-album-meta">
                                    <span>
                                        <Icon
                                            icon="mdi:music"
                                            width="14"
                                            height="14"
                                        />
                                        {fav.albumTracks} faixas
                                    </span>
                                    <span class="separator">•</span>
                                    <span>
                                        <Icon
                                            icon="mdi:calendar"
                                            width="14"
                                            height="14"
                                        />
                                        {formatDate(fav.favoritedAt)}
                                    </span>
                                </div>
                            </div>

                            <div class="list-item-actions">
                                <button
                                    class="list-action-btn"
                                    on:click={() =>
                                        openAlbumInSpotify(fav.albumId)}
                                    title="Abrir no Spotify"
                                >
                                    <Icon
                                        icon="mdi:spotify"
                                        width="20"
                                        height="20"
                                    />
                                </button>
                                <button
                                    class="list-action-btn list-remove-btn"
                                    on:click={() => removeFavorite(fav.albumId)}
                                    title="Remover dos favoritos"
                                >
                                    <Icon
                                        icon="mdi:heart-off"
                                        width="20"
                                        height="20"
                                    />
                                </button>
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
        min-height: 100vh;
        background: var(--bg-gradient-primary);
        padding-bottom: 40px;
    }

    .favorites-container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 40px 20px;
    }

    /* Barra de controles */
    .controls-bar {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        margin-bottom: 32px;
        align-items: center;
    }

    .favorites-stats {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 20px;
        background: var(--bg-card);
        border-radius: 12px;
        backdrop-filter: blur(10px);
        border: 1px solid var(--border-color);
        color: var(--text-primary);
        font-size: 0.95rem;
        box-shadow: var(--shadow-sm);
        white-space: nowrap;
    }

    .favorites-stats :global(svg) {
        color: #ff4757;
    }

    .search-bar {
        flex: 1;
        min-width: 250px;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 16px;
        background: var(--bg-card);
        border-radius: 12px;
        border: 1px solid var(--border-color);
        transition: all 0.3s ease;
    }

    .search-bar:focus-within {
        border-color: var(--accent-color);
        box-shadow: 0 0 0 3px rgba(var(--accent-rgb), 0.1);
    }

    .search-bar :global(svg) {
        color: var(--text-tertiary);
        flex-shrink: 0;
    }

    .favorites-search-input {
        flex: 1;
        border: none;
        width: 50%;
        background: transparent;
        color: var(--text-primary);
        font-size: 0.95rem;
        outline: none;
    }

    .favorites-search-input::placeholder {
        color: var(--text-tertiary);
    }

    .clear-search {
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-tertiary);
        transition: color 0.2s ease;
        border-radius: 4px;
    }

    .clear-search:hover {
        color: var(--text-primary);
        background: var(--bg-tertiary);
    }

    .view-controls {
        display: flex;
        gap: 12px;
        align-items: center;
    }

    .sort-dropdown {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 16px;
        background: var(--bg-card);
        border-radius: 12px;
        border: 1px solid var(--border-color);
    }

    .sort-dropdown :global(svg) {
        color: var(--text-tertiary);
    }

    .sort-select {
        border: none;
        background: transparent;
        color: var(--text-primary);
        font-size: 0.95rem;
        outline: none;
        cursor: pointer;
        font-weight: 500;
    }

    .sort-select option {
        background: var(--bg-secondary);
        color: var(--text-primary);
    }

    .view-mode-buttons {
        display: flex;
        gap: 4px;
        padding: 4px;
        background: var(--bg-card);
        border-radius: 12px;
        border: 1px solid var(--border-color);
    }

    .view-btn {
        padding: 8px 12px;
        background: transparent;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        color: var(--text-tertiary);
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .view-btn:hover {
        background: var(--bg-tertiary);
        color: var(--text-secondary);
    }

    .view-btn.active {
        background: var(--accent-color);
        color: white;
    }

    /* Grid view */
    .favorites-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 24px;
        animation: fadeIn 0.5s ease-in;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .album-card {
        background: var(--bg-card);
        border-radius: 12px;
        overflow: hidden;
        transition: all 0.3s ease;
        border: 1px solid var(--border-color);
        cursor: pointer;
        box-shadow: var(--shadow-sm);
    }

    .album-card:hover {
        transform: translateY(-8px);
        box-shadow: var(--shadow-lg);
        border-color: var(--border-light);
    }

    .album-cover {
        position: relative;
        width: 100%;
        aspect-ratio: 1;
        overflow: hidden;
        background: var(--bg-tertiary);
    }

    .album-cover img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
    }

    .album-card:hover .album-cover img {
        transform: scale(1.1);
    }

    .no-image {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-tertiary);
    }

    .album-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.6) 0%,
            rgba(0, 0, 0, 0.8) 100%
        );
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .album-card:hover .album-overlay {
        opacity: 1;
    }

    .action-btn {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(10px);
        color: white;
    }

    .spotify-btn:hover {
        background: #1db954;
        transform: scale(1.1);
    }

    .remove-btn:hover {
        background: #ff4757;
        transform: scale(1.1);
    }

    .album-info {
        padding: 16px;
    }

    .album-name {
        font-size: 1rem;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0 0 8px 0;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        line-height: 1.3;
    }

    .album-meta {
        display: flex;
        flex-direction: column;
        gap: 4px;
        font-size: 0.85rem;
        color: var(--text-secondary);
    }

    .album-meta span {
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .favorites-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
        animation: fadeIn 0.5s ease-in;
    }

    .album-list-item {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 16px;
        background: var(--bg-card);
        border-radius: 12px;
        border: 1px solid var(--border-color);
        transition: all 0.3s ease;
        box-shadow: var(--shadow-sm);
    }

    .album-list-item:hover {
        border-color: var(--border-light);
        box-shadow: var(--shadow-md);
        transform: translateX(4px);
    }

    .list-item-cover {
        width: 64px;
        height: 64px;
        border-radius: 8px;
        overflow: hidden;
        flex-shrink: 0;
        background: var(--bg-tertiary);
    }

    .list-item-cover img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .no-image-list {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-tertiary);
    }

    .list-item-info {
        flex: 1;
        min-width: 0;
    }

    .list-album-name {
        font-size: 1rem;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0 0 6px 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .list-album-meta {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.85rem;
        color: var(--text-secondary);
    }

    .list-album-meta span {
        display: flex;
        align-items: center;
        gap: 4px;
    }

    .separator {
        color: var(--text-tertiary);
    }

    .list-item-actions {
        display: flex;
        gap: 8px;
        flex-shrink: 0;
        align-items: center;
    }

    .list-action-btn {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        border: 1px solid var(--border-color);
        background: var(--bg-secondary);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition:
            background 0.2s ease,
            border-color 0.2s ease,
            color 0.2s ease;
        color: var(--text-secondary);
        flex-shrink: 0;
    }

    .list-action-btn:hover {
        background: #1db954;
        border-color: #1db954;
        color: white;
    }

    .list-action-btn.list-remove-btn:hover {
        background: #ff4757;
        border-color: #ff4757;
        color: white;
    }

    /* Estados vazios e erro */
    .no-results {
        text-align: center;
        padding: 80px 20px;
        color: var(--text-secondary);
    }

    .no-results :global(svg) {
        color: var(--text-tertiary);
        margin-bottom: 16px;
    }

    .no-results p {
        font-size: 1rem;
        margin: 0;
    }

    .error-message {
        text-align: center;
        color: var(--text-secondary);
        margin-top: 80px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
    }

    .error-message :global(svg) {
        color: #ff4757;
    }

    .retry-button {
        display: flex;
        align-items: center;
        gap: 8px;
        background: linear-gradient(135deg, #ff4757 0%, #ff6b81 100%);
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
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(255, 71, 87, 0.4);
    }

    .empty-state {
        text-align: center;
        margin: 80px auto;
        padding: 60px 40px;
        max-width: 500px;
        background: var(--bg-card);
        border-radius: 16px;
        border: 1px solid var(--border-color);
        box-shadow: var(--shadow-md);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
    }

    .empty-state :global(svg) {
        color: var(--text-tertiary);
    }

    .empty-state h3 {
        font-size: 1.5rem;
        color: var(--text-primary);
        margin: 0;
        font-weight: 600;
    }

    .empty-state p {
        font-size: 1rem;
        margin: 0;
        color: var(--text-secondary);
        line-height: 1.5;
    }

    .explore-button {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: var(--accent-color);
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

    .explore-button :global(svg) {
        color: white;
    }

    .explore-button:hover {
        background: var(--accent-hover);
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(var(--accent-rgb), 0.4);
    }

    /* Responsividade */
    @media (max-width: 968px) {
        .controls-bar {
            flex-direction: column;
            align-items: stretch;
        }

        .favorites-stats {
            width: 100%;
            justify-content: center;
        }

        .search-bar {
            width: 100%;
        }

        .view-controls {
            justify-content: space-between;
        }
    }

    @media (max-width: 768px) {
        .favorites-grid {
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            gap: 16px;
        }

        .favorites-container {
            padding: 24px 16px;
        }

        .controls-bar {
            gap: 12px;
            margin-bottom: 24px;
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

        .list-item-cover {
            width: 56px;
            height: 56px;
        }

        .list-album-name {
            font-size: 0.95rem;
        }

        .list-album-meta {
            font-size: 0.8rem;
            flex-wrap: wrap;
        }

        .list-action-btn {
            width: 36px;
            height: 36px;
        }

        .list-action-btn :global(svg) {
            width: 18px;
            height: 18px;
        }
    }

    @media (max-width: 480px) {
        .sort-dropdown {
            flex: 1;
        }

        .sort-select {
            width: 100%;
        }

        .view-mode-buttons {
            width: 100%;
            justify-content: center;
        }

        .album-list-item {
            flex-wrap: wrap;
            gap: 12px;
        }

        .list-item-actions {
            width: 100%;
            justify-content: flex-end;
        }
    }
</style>
