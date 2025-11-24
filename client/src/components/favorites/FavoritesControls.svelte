<script lang="ts">
    import Icon from "@iconify/svelte";
    import FavoritesStats from "./FavoritesStats.svelte";
    import FavoritesSearch from "./FavoritesSearch.svelte";
    import FavoritesSortView from "./FavoritesSortView.svelte";

    import "./FavoritesControls.css";

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
