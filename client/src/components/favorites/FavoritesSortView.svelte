<script lang="ts">
    import Icon from "@iconify/svelte";
    import { createEventDispatcher } from "svelte";

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
        outline: none;
        cursor: pointer;
        font-weight: 500;
    }

    .sort-select option {
        background: var(--bg-secondary);
        color: var(--text-primary);
    }

    .view-mode-buttons {
        display: flex;
        gap: 4px;
        padding: 4px;
        background: var(--bg-card);
        border-radius: 12px;
        border: 1px solid var(--border-color);
    }

    .view-btn {
        padding: 8px 12px;
        background: transparent;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        color: var(--text-tertiary);
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .view-btn:hover {
        background: var(--bg-tertiary);
        color: var(--text-secondary);
    }

    .view-btn.active {
        background: var(--accent-color);
        color: white;
    }

    /* Tablet */
    @media (max-width: 1024px) and (min-width: 769px) {
        .view-controls {
            width: 100%;
            justify-content: space-between;
            gap: 12px;
        }

        .sort-dropdown {
            flex: 1;
            min-width: 0;
            padding: 11px 15px;
        }

        .view-mode-buttons {
            flex-shrink: 0;
        }
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

        .view-btn {
            padding: 6px 10px;
        }
    }

    @media (max-width: 480px) {
        .view-controls {
            flex-direction: column;
            gap: 8px;
            width: 100%;
        }

        .sort-dropdown {
            width: 100%;
            justify-content: center;
            padding: 10px 14px;
            box-sizing: border-box;
        }

        .sort-select {
            width: 100%;
            text-align: center;
            font-size: 0.9rem;
        }

        .sort-dropdown :global(svg) {
            width: 16px;
            height: 16px;
        }

        .view-mode-buttons {
            width: 100%;
            justify-content: center;
            padding: 4px;
            box-sizing: border-box;
        }

        .view-btn {
            flex: 1;
            padding: 8px;
        }

        .view-btn :global(svg) {
            width: 18px;
            height: 18px;
        }
    }
</style>
