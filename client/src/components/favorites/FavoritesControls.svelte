<script lang="ts">
    import Icon from "@iconify/svelte";
    import FavoritesStats from "./FavoritesStats.svelte";
    import FavoritesSearch from "./FavoritesSearch.svelte";
    import FavoritesSortView from "./FavoritesSortView.svelte";

    export let totalFavorites: number;
    export let filteredCount: number;
    export let searchQuery: string;
    export let sortBy: "recent" | "alphabetical" | "release" | "tracks";
    export let viewMode: "grid" | "list";

    function handleSearchChange(e: CustomEvent<string>) {
        searchQuery = e.detail;
    }

    function handleClearSearch() {
        searchQuery = "";
    }

    function handleSortChange(e: CustomEvent<string>) {
        sortBy = e.detail as typeof sortBy;
    }

    function handleViewChange(e: CustomEvent<string>) {
        viewMode = e.detail as typeof viewMode;
    }
</script>

<div class="controls-bar">
    <FavoritesStats {totalFavorites} {filteredCount} />

    <FavoritesSearch bind:value={searchQuery} on:clear={handleClearSearch} />

    <FavoritesSortView
        {sortBy}
        {viewMode}
        on:sortChange={handleSortChange}
        on:viewChange={handleViewChange}
    />
</div>

<style>
    .controls-bar {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        margin-bottom: 32px;
        align-items: center;
        width: 100%;
    }

    /* Tablet */
    @media (max-width: 1024px) and (min-width: 769px) {
        .controls-bar {
            flex-direction: row;
            flex-wrap: wrap;
            gap: 14px;
            margin-bottom: 28px;
            width: 100%;
        }
    }

    @media (max-width: 968px) {
        .controls-bar {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
            width: 100%;
        }
    }

    @media (max-width: 768px) {
        .controls-bar {
            gap: 12px;
            margin-bottom: 24px;
            width: 100%;
        }
    }

    @media (max-width: 480px) {
        .controls-bar {
            gap: 8px;
            margin-bottom: 16px;
            width: 100%;
            padding: 0;
        }
        
        .controls-bar > :global(*) {
            width: 100%;
            margin: 0;
        }
    }
</style>
