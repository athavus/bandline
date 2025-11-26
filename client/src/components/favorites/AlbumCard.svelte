<script lang="ts">
    import Icon from "@iconify/svelte";
    import { createEventDispatcher } from "svelte";

    export let favoritesAlbumId: string;
    export let favoritesAlbumName: string;
    export let favoritesAlbumImage: string | undefined;
    export let favoritesAlbumTracks: string;
    export let favoritedAt: string;

    const dispatch = createEventDispatcher();

    function formatDate(dateString: string) {
        const date = new Date(dateString);
        return date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    }

    function handleOpenSpotify() {
        dispatch("openSpotify", favoritesAlbumId);
    }

    function handleRemove() {
        dispatch("remove", favoritesAlbumId);
    }
</script>

<div class="favorites-album-card">
    <div class="favorites-album-cover">
        {#if favoritesAlbumImage}
            <img
                src={favoritesAlbumImage}
                alt={favoritesAlbumName}
                loading="lazy"
            />
        {:else}
            <div class="no-image">
                <Icon icon="mdi:music-note" width="48" height="48" />
            </div>
        {/if}
        <div class="favorites-album-overlay">
            <button
                class="action-btn spotify-btn"
                on:click={handleOpenSpotify}
                title="Abrir no Spotify"
            >
                <Icon icon="mdi:spotify" width="24" height="24" />
            </button>
            <button
                class="action-btn remove-btn"
                on:click={handleRemove}
                title="Remover dos favoritos"
            >
                <Icon icon="mdi:heart-off" width="24" height="24" />
            </button>
        </div>
    </div>
    <div class="favorites-album-info">
        <h3 class="favorites-album-name">{favoritesAlbumName}</h3>
        <div class="favorites-album-meta">
            <span class="track-count">
                <Icon icon="mdi:music" width="14" height="14" />
                {favoritesAlbumTracks} faixas
            </span>
            <span class="favorite-date">
                <Icon icon="mdi:calendar" width="14" height="14" />
                {formatDate(favoritedAt)}
            </span>
        </div>
    </div>
</div>

<style>
    .favorites-album-card {
        background: var(--bg-card);
        border-radius: 12px;
        overflow: hidden;
        transition: all 0.3s ease;
        border: 1px solid var(--border-color);
        cursor: pointer;
        box-shadow: var(--shadow-sm);
    }

    .favorites-album-card:hover {
        transform: translateY(-8px);
        box-shadow: var(--shadow-lg);
        border-color: var(--border-light);
    }

    .favorites-album-cover {
        position: relative;
        width: 100%;
        aspect-ratio: 1;
        overflow: hidden;
        background: var(--bg-tertiary);
    }

    .favorites-album-cover img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
    }

    .favorites-album-card:hover .favorites-album-cover img {
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

    .favorites-album-overlay {
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

    .favorites-album-card:hover .favorites-album-overlay {
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

    .favorites-album-info {
        padding: 16px;
    }

    .favorites-album-name {
        font-size: 1rem;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0 0 8px 0;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        line-clamp: 2;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        line-height: 1.3;
    }

    .favorites-album-meta {
        display: flex;
        flex-direction: column;
        gap: 4px;
        font-size: 0.85rem;
        color: var(--text-secondary);
    }

    .favorites-album-meta span {
        display: flex;
        align-items: center;
        gap: 6px;
    }
</style>
