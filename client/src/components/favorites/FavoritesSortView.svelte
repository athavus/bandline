<script lang="ts">
    import Icon from "@iconify/svelte";
    import { createEventDispatcher } from "svelte";

    import "./FavoritesSortView.css";

    export let sortBy: "recent" | "alphabetical" | "release" | "tracks";
    export let viewMode: "grid" | "list";

    const dispatch = createEventDispatcher();

    function handleSortChange(event: Event) {
        const target = event.target as HTMLSelectElement;
        dispatch("sortChange", target.value);
    }

    function handleViewChange(mode: "grid" | "list") {
        dispatch("viewChange", mode);
    }
</script>

<div class="view-controls">
    <div class="sort-dropdown">
        <Icon icon="mdi:sort" width="18" height="18" />
        <select value={sortBy} on:change={handleSortChange} class="sort-select">
            <option value="recent">Mais Recentes</option>
            <option value="alphabetical">A-Z</option>
            <option value="release">Lançamento</option>
            <option value="tracks">Mais Faixas</option>
        </select>
    </div>

    <div class="view-mode-buttons">
        <button
            class="view-btn"
            class:active={viewMode === "grid"}
            on:click={() => handleViewChange("grid")}
            title="Visualização em grade"
        >
            <Icon icon="mdi:grid" width="20" height="20" />
        </button>
        <button
            class="view-btn"
            class:active={viewMode === "list"}
            on:click={() => handleViewChange("list")}
            title="Visualização em lista"
        >
            <Icon icon="mdi:format-list-bulleted" width="20" height="20" />
        </button>
    </div>
</div>
