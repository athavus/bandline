<script lang="ts">
    import Icon from "@iconify/svelte";
    import type { HistoryItem } from "../../types/history";

    export let history: HistoryItem;
    export let index: number;
    export let onArtistClick: (artistId: string, artistName: string) => void;

    function formatDate(dateString: string): string {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "Agora";
        if (diffMins < 60) return `${diffMins} min atrás`;
        if (diffHours < 24) return `${diffHours}h atrás`;
        if (diffDays < 7) return `${diffDays}d atrás`;

        return date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    }
</script>

<div
    class="history-card"
    on:click={() => onArtistClick(history.artistId, history.artistName)}
    role="button"
    tabindex="0"
    on:keydown={(e) =>
        e.key === "Enter" &&
        onArtistClick(history.artistId, history.artistName)}
>
    <div class="card-rank">
        <span class="rank-number">#{index + 1}</span>
    </div>

    <div class="card-image-wrapper">
        {#if history.artistAvatar}
            <img
                src={history.artistAvatar}
                alt={history.artistName}
                class="artist-image"
            />
            <div class="image-overlay">
                <Icon icon="mdi:play-circle" width="48" height="48" />
            </div>
        {:else}
            <div class="artist-image-placeholder">
                <span class="placeholder-letter"
                    >{history.artistName.charAt(0).toUpperCase()}</span
                >
                <div class="image-overlay">
                    <Icon icon="mdi:play-circle" width="48" height="48" />
                </div>
            </div>
        {/if}
    </div>

    <div class="card-content">
        <h3 class="artist-name">
            {history.artistName}
        </h3>
        <div class="card-meta">
            <span class="meta-item">
                <Icon icon="mdi:clock-outline" width="14" height="14" />
                {formatDate(history.searchedAt)}
            </span>
        </div>
    </div>

    <div class="card-action">
        <Icon icon="mdi:arrow-right" width="24" height="24" />
    </div>
</div>

<style>
    .history-card {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 16px;
        background: var(--bg-secondary, #181818);
        border: 1px solid var(--border-color, #282828);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .history-card:hover {
        background: var(--bg-hover, #282828);
        border-color: var(--text-secondary, #b3b3b3);
    }

    .card-rank {
        flex-shrink: 0;
    }

    .rank-number {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        font-weight: 600;
        font-size: 0.875rem;
        color: var(--text-secondary, #b3b3b3);
    }

    .card-image-wrapper {
        flex-shrink: 0;
        position: relative;
    }

    .artist-image,
    .artist-image-placeholder {
        width: 64px;
        height: 64px;
        border-radius: 6px;
        transition: opacity 0.2s ease;
    }

    .artist-image {
        object-fit: cover;
    }

    .artist-image-placeholder {
        background: linear-gradient(135deg, #1db954, #1ed760);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
    }

    .placeholder-letter {
        font-size: 1.5rem;
        font-weight: 700;
        color: #ffffff;
    }

    .image-overlay {
        display: none;
    }

    .card-content {
        flex: 1;
        min-width: 0;
    }

    .artist-name {
        font-size: 0.9375rem;
        font-weight: 600;
        color: var(--text-primary, #ffffff);
        margin: 0 0 6px 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .card-meta {
        display: flex;
        gap: 12px;
    }

    .meta-item {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 0.8125rem;
        color: var(--text-secondary, #b3b3b3);
    }

    .card-action {
        color: var(--text-secondary, #b3b3b3);
        opacity: 0;
        transition: opacity 0.2s ease;
    }

    .history-card:hover .card-action {
        opacity: 1;
    }

    @media (max-width: 768px) {
        .history-card {
            padding: 16px;
        }

        .rank-number {
            width: 36px;
            height: 36px;
            font-size: 0.85rem;
        }

        .artist-image,
        .artist-image-placeholder {
            width: 64px;
            height: 64px;
        }

        .placeholder-letter {
            font-size: 1.5rem;
        }

        .artist-name {
            font-size: 1rem;
        }

        .meta-item {
            font-size: 0.8rem;
        }
    }

    @media (max-width: 480px) {
        .history-card {
            padding: 14px;
            gap: 12px;
        }

        .rank-number {
            width: 32px;
            height: 32px;
            font-size: 0.8rem;
        }

        .artist-image,
        .artist-image-placeholder {
            width: 56px;
            height: 56px;
        }

        .placeholder-letter {
            font-size: 1.25rem;
        }

        .artist-name {
            font-size: 0.95rem;
        }
    }
</style>
