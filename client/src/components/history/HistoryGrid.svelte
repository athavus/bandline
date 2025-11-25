<script lang="ts">
    import HistoryCard from "./HistoryCard.svelte";
    import type { HistoryItem } from "../../types/history";

    import "./HistoryGrid.css";

    export let histories: HistoryItem[];
    export let onArtistClick: (artistId: string, artistName: string) => void;
</script>

<div class="history-grid">
    {#each histories as history, index (history.id)}
        <HistoryCard {history} {index} {onArtistClick} />
    {/each}
</div>
