<script lang="ts">
    import Icon from "@iconify/svelte";
    import { createEventDispatcher } from "svelte";

    export let albumId: string = "";
    export let albumName: string = "";
    export let albumImage: string | undefined = undefined;
    export let albumTracks: string = "0";
    export let completedAt: string = "";

    const dispatch = createEventDispatcher();

    function formatDate(dateString: string) {
        if (!dateString) return "Data desconhecida";
        const date = new Date(dateString);
        return date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    }

    function handleOpenSpotify() {
        dispatch("openSpotify", albumId);
    }

    function handleRemove() {
        dispatch("remove", albumId);
    }

    // Debug
    $: console.log("PlaylistsAlbumListItem rendered:", {
        albumId,
        albumName,
        albumTracks,
    });
</script>

<div class="playlists-album-list-item">
    <div class="list-item-cover">
        {#if albumImage}
            <img src={albumImage} alt={albumName} loading="lazy" />
        {:else}
            <div class="no-image-list">
                <Icon icon="mdi:music-note" width="24" height="24" />
            </div>
        {/if}
    </div>

    <div class="list-item-content">
        <div class="list-item-main">
            <h4 class="list-item-title">{albumName}</h4>
            <div class="list-item-meta">
                <span class="meta-item">
                    <Icon icon="mdi:music-note" width="16" height="16" />
                    {albumTracks} faixas
                </span>
                <span class="meta-item">
                    <Icon icon="mdi:calendar-check" width="16" height="16" />
                    Concluído em {formatDate(completedAt)}
                </span>
            </div>
        </div>

        <div class="list-item-actions">
            <button
                class="action-btn spotify-btn"
                on:click={handleOpenSpotify}
                title="Abrir no Spotify"
            >
                <Icon icon="mdi:spotify" width="20" height="20" />
            </button>
            <button
                class="action-btn remove-btn"
                on:click={handleRemove}
                title="Remover dos concluídos"
            >
                <Icon icon="mdi:close" width="20" height="20" />
            </button>
        </div>
    </div>
</div>

<style>
    .playlists-album-list-item {
        display: flex;
        gap: 20px;
        padding: 24px;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 16px;
        transition: all 0.3s ease;
        box-shadow: var(--shadow-sm);
        align-items: center;
    }

    .playlists-album-list-item:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
        border-color: var(--accent-color);
    }

    .list-item-cover {
        flex-shrink: 0;
        width: 80px;
        height: 80px;
        border-radius: 12px;
        overflow: hidden;
        background: var(--bg-secondary);
        box-shadow: var(--shadow-sm);
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
        background: var(--bg-tertiary);
    }

    .list-item-content {
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 24px;
        min-width: 0;
    }

    .list-item-main {
        flex: 1;
        min-width: 0;
    }

    .list-item-title {
        font-size: 20px;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0 0 12px 0;
        line-height: 1.3;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .list-item-meta {
        display: flex;
        gap: 24px;
        font-size: 14px;
        color: var(--text-secondary);
        flex-wrap: wrap;
    }

    .meta-item {
        display: flex;
        align-items: center;
        gap: 6px;
        font-weight: 500;
    }

    .list-item-actions {
        display: flex;
        flex-direction: column;
        gap: 8px;
        align-items: flex-end;
        flex-shrink: 0;
    }

    .action-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: var(--shadow-sm);
    }

    .action-btn:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
    }

    .spotify-btn {
        background: #1db954;
        color: white;
    }

    .spotify-btn:hover {
        background: #1ed760;
    }

    .remove-btn {
        background: transparent;
        border: 2px solid var(--error-color, #dc143c);
        color: var(--error-color, #dc143c);
    }

    .remove-btn:hover {
        background: var(--error-color, #dc143c);
        color: white;
    }

    @media (max-width: 1024px) {
        .playlists-album-list-item {
            padding: 20px;
            gap: 16px;
        }

        .list-item-cover {
            width: 70px;
            height: 70px;
        }

        .list-item-title {
            font-size: 18px;
        }

        .list-item-meta {
            gap: 16px;
        }
    }

    @media (max-width: 768px) {
        .playlists-album-list-item {
            flex-direction: column;
            padding: 16px;
            gap: 16px;
            align-items: flex-start;
        }

        .list-item-content {
            width: 100%;
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
        }

        .list-item-main {
            width: 100%;
        }

        .list-item-title {
            font-size: 16px;
            margin-bottom: 8px;
            white-space: normal;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            display: -webkit-box;
        }

        .list-item-meta {
            flex-direction: column;
            gap: 8px;
            width: 100%;
        }

        .list-item-actions {
            flex-direction: row;
            gap: 12px;
            width: 100%;
            justify-content: flex-end;
        }

        .action-btn {
            width: 44px;
            height: 44px;
        }
    }

    @media (max-width: 480px) {
        .playlists-album-list-item {
            padding: 12px;
        }

        .list-item-cover {
            width: 60px;
            height: 60px;
        }

        .list-item-title {
            font-size: 15px;
        }

        .list-item-meta {
            font-size: 13px;
            gap: 6px;
        }

        .meta-item {
            gap: 4px;
        }

        .meta-item svg {
            width: 14px;
            height: 14px;
        }

        .list-item-actions {
            gap: 8px;
        }

        .action-btn {
            width: 40px;
            height: 40px;
        }

        .action-btn svg {
            width: 18px;
            height: 18px;
        }
    }
</style>
