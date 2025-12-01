<script lang="ts">
    import { onMount } from "svelte";
    import Header from "../components/Header.svelte";
    import Sidebar from "../components/Sidebar.svelte";
    import Loading from "../components/utils/Loading.svelte";
    import { auth } from "../lib/stores/auth";
    import { replace } from "../lib/router";
    import { t } from "../lib/stores/language";

    interface CompletedAlbum {
        id: number;
        albumId: string;
        albumName: string;
        albumImage?: string;
        albumTracks: string;
        completedAt: string;
    }

    const API_URL = import.meta.env.VITE_API_URL;

    let completedAlbums: CompletedAlbum[] = [];
    let loading = true;
    let error: string | null = null;
    let sidebarOpen = false;

    $: authState = $auth;

    onMount(async () => {
        await auth.checkAuth();
        if (!$auth.isAuthenticated) {
            replace("/");
            return;
        }
        await fetchCompletedAlbums();
    });

    async function fetchCompletedAlbums() {
        loading = true;
        error = null;
        try {
            const response = await fetch(`${API_URL}/completedAlbums`, {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });
            if (response.status === 401) {
                auth.logout();
                window.location.href = "/";
                return;
            }
            if (!response.ok)
                throw new Error(
                    `Erro ao buscar concluídos: ${response.status}`,
                );
            const data = await response.json();
            completedAlbums = data.completedAlbums || [];
        } catch (err) {
            console.error("Erro ao buscar concluídos:", err);
            error = "Não foi possível carregar os álbuns concluídos.";
        } finally {
            loading = false;
        }
    }

    async function removeCompleted(albumId: string) {
        if (
            !confirm(
                "Tem certeza que deseja remover este álbum dos concluídos?",
            )
        )
            return;
        try {
            const response = await fetch(`${API_URL}/completedAlbums`, {
                method: "DELETE",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ albumId }),
            });
            if (!response.ok) throw new Error("Erro ao remover álbum");
            completedAlbums = completedAlbums.filter(
                (a) => a.albumId !== albumId,
            );
        } catch (err) {
            alert("Erro ao remover álbum dos concluídos.");
        }
    }

    function openAlbumInSpotify(albumId: string) {
        window.open(`https://open.spotify.com/album/${albumId}`, "_blank");
    }

    function formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString("pt-BR", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
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
</script>

<Sidebar bind:open={sidebarOpen} on:action={handleSidebarAction} />

<main class:sidebar-open={sidebarOpen}>
    <Header bind:sidebarOpen on:toggleSidebar={toggleSidebar} />

    <div class="completed-container">
        {#if loading}
            <Loading message="Carregando álbuns concluídos..." />
        {:else if error}
            <div class="error-state">
                <p class="error-message">{error}</p>
                <button class="retry-btn" on:click={fetchCompletedAlbums}>
                    Tentar novamente
                </button>
            </div>
        {:else if completedAlbums.length > 0}
            <section class="content-section">
                <div class="section-header">
                    <h2>Álbuns Concluídos</h2>
                </div>

                <div class="albums-grid">
                    {#each completedAlbums as album}
                        <div
                            class="album-card"
                            tabindex="0"
                            role="button"
                            on:click={() => openAlbumInSpotify(album.albumId)}
                            on:keydown={(e) =>
                                e.key === "Enter" &&
                                openAlbumInSpotify(album.albumId)}
                        >
                            {#if album.albumImage}
                                <img
                                    src={album.albumImage}
                                    alt={album.albumName}
                                    class="album-image"
                                />
                            {:else}
                                <div class="album-placeholder">
                                    <svg
                                        width="48"
                                        height="48"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                    >
                                        <path
                                            d="M9 18V5l12-2v13M9 18c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3
                                                 3 1.343 3 3zm12-2c0 1.657-1.343 3-3 3s-3-1.343-3-3
                                                 1.343-3 3-3 3 1.343 3 3z"
                                        />
                                    </svg>
                                </div>
                            {/if}
                            <div class="album-info">
                                <h3 class="album-name">{album.albumName}</h3>
                                <p class="album-tracks">
                                    {album.albumTracks} faixas
                                </p>
                                <p class="completed-at">
                                    Concluído em {formatDate(album.completedAt)}
                                </p>
                                <button
                                    class="remove-btn"
                                    title="Remover dos concluídos"
                                    on:click|stopPropagation={() =>
                                        removeCompleted(album.albumId)}
                                >
                                    Remover
                                </button>
                            </div>
                        </div>
                    {/each}
                </div>
            </section>
        {:else}
            <div class="empty-completed">
                <svg
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                </svg>
                <h3>Nenhum álbum concluído ainda</h3>
                <p>Complete álbuns para vê-los aqui!</p>
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

    .completed-container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 40px 20px;
    }

    .content-section {
        margin-bottom: 48px;
    }

    .section-header {
        display: flex;
        align-items: center;
        margin-bottom: 24px;
    }

    .section-header h2 {
        font-size: 28px;
        font-weight: 700;
        color: var(--text-primary);
        margin: 0;
    }

    .albums-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 24px;
    }

    .album-card {
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 16px;
        cursor: pointer;
        transition: all 0.3s;
        box-shadow: var(--shadow-sm);
        display: flex;
        flex-direction: column;
        gap: 12px;
        outline: none;
    }

    .album-card:hover,
    .album-card:focus-visible {
        background: var(--bg-hover);
        border-color: var(--border-light);
        transform: translateY(-4px);
        box-shadow: var(--shadow-md);
    }

    .album-image {
        width: 100%;
        aspect-ratio: 1;
        object-fit: cover;
        border-radius: 4px;
        margin-bottom: 12px;
        box-shadow: var(--shadow-sm);
    }

    .album-placeholder {
        width: 100%;
        aspect-ratio: 1;
        background: var(--bg-tertiary);
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 12px;
        color: var(--text-tertiary);
    }

    .album-info {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    .album-name {
        font-size: 16px;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .album-tracks {
        font-size: 14px;
        color: var(--text-secondary);
        margin: 0;
    }

    .completed-at {
        font-size: 13px;
        color: var(--text-tertiary);
        margin: 0 0 4px 0;
    }

    .remove-btn {
        align-self: flex-start;
        margin-top: 8px;
        padding: 7px 16px;
        background: var(--error-bg, #fbeaf0);
        border: 1px solid var(--border-color);
        border-radius: 20px;
        color: var(--error-color, #d32f2f);
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
    }
    .remove-btn:hover {
        background: var(--error-color, #d32f2f);
        color: #fff;
        border-color: var(--border-light);
    }

    .empty-completed {
        text-align: center;
        padding: 80px 20px;
        color: var(--text-secondary);
    }

    .empty-completed svg {
        margin-bottom: 24px;
        opacity: 0.5;
        stroke: var(--text-secondary);
    }

    .empty-completed h3 {
        font-size: 24px;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0 0 12px 0;
    }

    .empty-completed p {
        font-size: 16px;
        margin: 0;
    }

    /* Error State + Retry */
    .error-state {
        text-align: center;
        padding: 80px 20px;
    }
    .error-message {
        color: var(--error-color, #d32f2f);
        font-size: 18px;
        margin-bottom: 24px;
    }
    .retry-btn {
        padding: 12px 32px;
        background: var(--accent-color, #36cfc9);
        color: white;
        border: none;
        border-radius: 24px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
    }
    .retry-btn:hover {
        background: var(--accent-hover, #15b8ae);
        transform: scale(1.05);
    }

    @media (max-width: 768px) {
        .completed-container {
            padding: 24px 16px;
        }
        .albums-grid {
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
            gap: 16px;
        }
    }
</style>
