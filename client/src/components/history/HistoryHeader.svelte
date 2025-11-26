<script lang="ts">
    import HistoryStats from "./HistoryStats.svelte";
    import HistorySearch from "./HistorySearch.svelte";
    import HistoryControls from "./HistoryControls.svelte";

    export let totalArtists: number;
    export let searchQuery: string;
    export let viewMode: "grid" | "list";
    export let onClearSearch: () => void;
    export let onViewModeChange: (mode: "grid" | "list") => void;
</script>

<div class="history-header">
    <HistoryStats {totalArtists} />
    <HistorySearch bind:searchQuery {onClearSearch} />
    <HistoryControls {viewMode} {onViewModeChange} />
</div>

<style>
    .history-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        gap: 16px;
        flex-wrap: wrap;
    }

    @media (max-width: 768px) {
        .history-header {
            flex-direction: column;
            align-items: stretch;
            gap: 16px;
        }

        .history-header :global(.history-stats) {
            justify-content: center;
        }

        .history-header :global(.history-search-bar) {
            max-width: 100%;
            order: -1;
        }

        .history-header :global(.view-controls) {
            justify-content: center;
        }
    }
</style>
