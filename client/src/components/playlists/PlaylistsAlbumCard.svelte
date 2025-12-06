<script lang="ts">
    import Icon from "@iconify/svelte";
    import { createEventDispatcher } from "svelte";

    // Props renomeadas para coincidir com o uso no PlaylistsList
    export let albumId: string;
    export let albumName: string;
    export let albumImage: string | undefined;
    export let albumTracks: string;
    export let completedAt: string;

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
        dispatch("openSpotify", albumId);
    }

    function handleRemove() {
        dispatch("remove", albumId);
    }
</script>

<div class="playlists-album-card">
    <div class="playlists-album-cover">
        {#if albumImage}
            <img src={albumImage} alt={albumName} loading="lazy" />
        {:else}
            <div class="no-image">
                <Icon icon="mdi:music-note" width="48" height="48" />
            </div>
        {/if}
        <div class="playlists-album-overlay">
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
                title="Remover dos concluídos"
            >
                <Icon icon="mdi:close" width="24" height="24" />
            </button>
        </div>
    </div>

    <div class="playlists-album-info">
        <h4 class="playlists-album-name">{albumName}</h4>
        <div class="playlists-album-meta">
            <span class="track-count">{albumTracks} faixas</span>
            <span class="completed-date">{formatDate(completedAt)}</span>
        </div>
    </div>
</div>

<style>
    .playlists-album-card {
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        overflow: hidden;
        transition: all 0.3s ease;
        box-shadow: var(--shadow-sm);
        cursor: pointer;
    }

    .playlists-album-card:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-lg);
        border-color: var(--accent-color);
    }

    .playlists-album-cover {
        position: relative;
        width: 100%;
        aspect-ratio: 1;
        background: var(--bg-secondary);
        overflow: hidden;
    }

    .playlists-album-cover img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
    }

    .playlists-album-card:hover .playlists-album-cover img {
        transform: scale(1.05);
    }

    .no-image {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-tertiary);
        background: var(--bg-tertiary);
    }

    .playlists-album-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 12px;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .playlists-album-card:hover .playlists-album-overlay {
        opacity: 1;
    }

    .action-btn {
        background: rgba(255, 255, 255, 0.9);
        border: none;
        border-radius: 50%;
        width: 44px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: var(--shadow-sm);
    }

    .action-btn:hover {
        transform: scale(1.1);
        box-shadow: var(--shadow-md);
    }

    .spotify-btn {
        background: #1db954 !important;
        color: white;
    }

    .spotify-btn:hover {
        background: #1ed760 !important;
    }

    .remove-btn {
        background: var(--error-color, #dc143c) !important;
        color: white;
    }

    .remove-btn:hover {
        background: #ff4757 !important;
    }

    .playlists-album-info {
        padding: 16px;
    }

    .playlists-album-name {
        font-size: 16px;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0 0 8px 0;
        line-height: 1.3;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .playlists-album-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 12px;
        color: var(--text-secondary);
        gap: 8px;
    }

    .track-count {
        font-weight: 500;
    }

    .completed-date {
        font-style: italic;
        opacity: 0.8;
    }

    @media (max-width: 768px) {
        .playlists-album-info {
            padding: 12px;
        }

        .playlists-album-name {
            font-size: 14px;
        }

        .playlists-album-meta {
            font-size: 11px;
        }
    }
</style>
