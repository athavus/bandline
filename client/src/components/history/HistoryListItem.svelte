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
    class="history-list-item"
    on:click={() => onArtistClick(history.artistId, history.artistName)}
    role="button"
    tabindex="0"
    on:keydown={(e) =>
        e.key === "Enter" &&
        onArtistClick(history.artistId, history.artistName)}
>
    <div class="item-rank">
        <span class="rank-number">#{index + 1}</span>
    </div>

    <div class="item-image-wrapper">
        {#if history.artistAvatar}
            <img
                src={history.artistAvatar}
                alt={history.artistName}
                class="artist-image"
            />
        {:else}
            <div class="artist-image-placeholder">
                <span class="placeholder-letter"
                    >{history.artistName.charAt(0).toUpperCase()}</span
                >
            </div>
        {/if}
    </div>

    <div class="item-content">
        <h3 class="artist-name">
            {history.artistName}
        </h3>
        <div class="item-meta">
            <span class="meta-item">
                <Icon icon="mdi:clock-outline" width="14" height="14" />
                {formatDate(history.searchedAt)}
            </span>
        </div>
    </div>

    <div class="item-action">
        <Icon icon="mdi:arrow-right" width="24" height="24" />
    </div>
</div>

<style>
    .history-list-item {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 12px 16px;
        background: var(--bg-secondary, #181818);
        border: 1px solid var(--border-color, #282828);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .history-list-item:hover {
        background: var(--bg-hover, #282828);
        border-color: var(--text-secondary, #b3b3b3);
    }

    .item-rank {
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

    .item-image-wrapper {
        flex-shrink: 0;
    }

    .artist-image,
    .artist-image-placeholder {
        width: 56px;
        height: 56px;
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
    }

    .placeholder-letter {
        font-size: 1.25rem;
        font-weight: 700;
        color: #ffffff;
    }

    .item-content {
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

    .item-meta {
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

    .item-action {
        color: var(--text-secondary, #b3b3b3);
        opacity: 0;
        transition: opacity 0.2s ease;
    }

    .history-list-item:hover .item-action {
        opacity: 1;
    }
</style>
