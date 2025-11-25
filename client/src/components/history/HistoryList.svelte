<script lang="ts">
    import HistoryListItem from "./HistoryListItem.svelte";
    import type { HistoryItem } from "../../types/history";

    import "./HistoryList.css";

    export let histories: HistoryItem[];
    export let onArtistClick: (artistId: string, artistName: string) => void;
</script>

<div class="history-list">
    {#each histories as history, index (history.id)}
        <HistoryListItem {history} {index} {onArtistClick} />
    {/each}
</div>
