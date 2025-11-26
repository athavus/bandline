<script lang="ts">
    import Icon from "@iconify/svelte";
    import { translations$ } from "../../lib/stores/language";

    export let viewMode: "grid" | "list";
    export let onViewModeChange: (mode: "grid" | "list") => void;
</script>

<div class="view-controls">
    <button
        class="view-button"
        class:active={viewMode === "grid"}
        on:click={() => onViewModeChange("grid")}
        title={$translations$.gridView}
    >
        <Icon icon="mdi:view-grid" width="20" height="20" />
    </button>
    <button
        class="view-button"
        class:active={viewMode === "list"}
        on:click={() => onViewModeChange("list")}
        title={$translations$.listView}
    >
        <Icon icon="mdi:view-list" width="20" height="20" />
    </button>
</div>

<style>
    .view-controls {
        display: flex;
        gap: 8px;
    }

    .view-button {
        padding: 8px 12px;
        background: var(--bg-secondary, #181818);
        border: 1px solid var(--border-color, #282828);
        border-radius: 6px;
        color: var(--text-secondary, #b3b3b3);
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .view-button:hover {
        background: var(--bg-hover, #282828);
        border-color: var(--text-secondary, #b3b3b3);
    }

    .view-button.active {
        background: var(--accent-color, #1db954);
        border-color: var(--accent-color, #1db954);
        color: #ffffff;
    }
</style>
