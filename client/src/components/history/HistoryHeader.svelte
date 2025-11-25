<script lang="ts">
    import HistoryStats from "./HistoryStats.svelte";
    import HistorySearch from "./HistorySearch.svelte";
    import HistoryControls from "./HistoryControls.svelte";

    import "./HistoryHeader.css";

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
