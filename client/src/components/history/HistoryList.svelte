<script lang="ts">
    import HistoryListItem from "./HistoryListItem.svelte";
    import type { HistoryItem } from "../../types/history";

    export let histories: HistoryItem[];
    export let onArtistClick: (artistId: string, artistName: string) => void;
</script>

<div class="history-list">
    {#each histories as history, index (history.id)}
        <HistoryListItem {history} {index} {onArtistClick} />
    {/each}
</div>

<style>
    .history-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
        max-width: 900px;
        margin: 0 auto;
    }
</style>
