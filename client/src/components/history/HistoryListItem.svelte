<script lang="ts">
    import Icon from "@iconify/svelte";
    import type { HistoryItem } from "../../types/history";

    import "./HistoryListItem.css";

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
