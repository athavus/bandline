<script lang="ts">
    import Icon from "@iconify/svelte";
    import { createEventDispatcher } from "svelte";

    export let albumId: string = "";
    export let albumName: string = "";
    export let albumImage: string | undefined = undefined;
    export let albumTracks: string = "0";
    export let favoritedAt: string = "";

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
    $: console.log("AlbumListItem rendered:", {
        albumId,
        albumName,
        albumTracks,
    });
</script>

<div class="album-list-item">
    <div class="list-item-cover">
        {#if albumImage}
            <img src={albumImage} alt={albumName} loading="lazy" />
        {:else}
            <div class="no-image-list">
                <Icon icon="mdi:music-note" width="24" height="24" />
            </div>
        {/if}
    </div>

    <div class="list-item-info">
        <h3 class="list-album-name">{albumName}</h3>
        <div class="list-album-meta">
            <span>
                <Icon icon="mdi:music" width="14" height="14" />
                {albumTracks} faixas
            </span>
            <span class="separator">•</span>
            <span>
                <Icon icon="mdi:calendar" width="14" height="14" />
                {formatDate(favoritedAt)}
            </span>
        </div>
    </div>

    <div class="list-item-actions">
        <button
            class="list-action-btn"
            on:click={handleOpenSpotify}
            title="Abrir no Spotify"
        >
            <Icon icon="mdi:spotify" width="20" height="20" />
        </button>
        <button
            class="list-action-btn list-remove-btn"
            on:click={handleRemove}
            title="Remover dos favoritos"
        >
            <Icon icon="mdi:heart-off" width="20" height="20" />
        </button>
    </div>
</div>

<style>
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

    @media (max-width: 768px) {
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
