<script lang="ts">
    import Icon from "@iconify/svelte";
    import { createEventDispatcher } from "svelte";

    export let sortBy: "recent" | "alphabetical" | "tracks";
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

<style>
    .view-controls {
        display: flex;
        gap: 12px;
        align-items: center;
    }

    .sort-dropdown {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 16px;
        background: var(--bg-card);
        border-radius: 12px;
        border: 1px solid var(--border-color);
    }

    .sort-dropdown :global(svg) {
        color: var(--text-tertiary);
    }

    .sort-select {
        border: none;
        background: transparent;
        color: var(--text-primary);
        font-size: 0.95rem;
        font-weight: 500;
        cursor: pointer;
        outline: none;
        min-width: 120px;
    }

    .view-mode-buttons {
        display: flex;
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid var(--border-color);
    }

    .view-btn {
        background: transparent;
        border: none;
        padding: 12px 16px;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-secondary);
    }

    .view-btn:hover {
        background: var(--bg-hover);
        color: var(--text-primary);
    }

    .view-btn.active {
        background: var(--accent-color);
        color: white;
    }

    @media (max-width: 968px) {
        .view-controls {
            width: 100%;
            justify-content: space-between;
        }

        .sort-dropdown {
            flex: 1;
            min-width: 0;
        }

        .view-mode-buttons {
            flex-shrink: 0;
        }
    }

    @media (max-width: 768px) {
        .view-controls {
            gap: 10px;
        }

        .sort-dropdown {
            padding: 10px 14px;
        }

        .sort-select {
            font-size: 0.9rem;
        }

        .view-btn {
            padding: 10px 14px;
        }
    }

    @media (max-width: 480px) {
        .view-controls {
            flex-direction: column;
            gap: 8px;
        }

        .sort-dropdown {
            width: 100%;
            justify-content: center;
        }

        .sort-select {
            width: 100%;
            text-align: center;
        }

        .view-mode-buttons {
            width: 100%;
        }

        .view-btn {
            flex: 1;
        }
    }
</style>
