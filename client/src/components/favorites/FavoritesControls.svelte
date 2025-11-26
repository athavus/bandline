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
    }

    @media (max-width: 968px) {
        .controls-bar {
            flex-direction: column;
            align-items: stretch;
        }
    }

    @media (max-width: 768px) {
        .controls-bar {
            gap: 12px;
            margin-bottom: 24px;
        }
    }
</style>
