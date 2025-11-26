<script lang="ts">
    import HistoryCard from "./HistoryCard.svelte";
    import type { HistoryItem } from "../../types/history";

    export let histories: HistoryItem[];
    export let onArtistClick: (artistId: string, artistName: string) => void;
</script>

<div class="history-grid">
    {#each histories as history, index (history.id)}
        <HistoryCard {history} {index} {onArtistClick} />
    {/each}
</div>

<style>
    .history-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 16px;
    }

    @media (max-width: 768px) {
        .history-grid {
            grid-template-columns: 1fr;
        }
    }
</style>
