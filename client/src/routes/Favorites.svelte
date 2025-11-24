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
        favoritedAt: string;
    }

    let favorites: FavoriteAlbum[] = [];
    let loading = true;
    let error: string | null = null;
    let sidebarOpen = false;

    const API_URL = import.meta.env.VITE_API_URL;
    $: authState = $auth;

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
            <div class="favorites-stats">
                <Icon icon="mdi:heart" width="20" height="20" />
                <span
                    >{favorites.length}
                    {favorites.length === 1
                        ? "álbum favoritado"
                        : "álbuns favoritados"}</span
                >
            </div>

            <div class="favorites-grid">
                {#each favorites as fav (fav.id)}
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
                                    on:click={() => removeFavorite(fav.albumId)}
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

    .favorites-stats {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 24px;
        padding: 16px 20px;
        background: var(--bg-card);
        border-radius: 12px;
        backdrop-filter: blur(10px);
        border: 1px solid var(--border-color);
        color: var(--text-primary);
        font-size: 0.95rem;
        box-shadow: var(--shadow-sm);
    }

    .favorites-stats :global(svg) {
        color: #ff4757;
    }

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

    @media (max-width: 768px) {
        .favorites-grid {
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            gap: 16px;
        }

        .favorites-container {
            padding: 24px 16px;
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
</style>
