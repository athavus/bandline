<script lang="ts">
    import Icon from "@iconify/svelte";
    import { translations$ } from "../../lib/stores/language";

    export let searchQuery: string;
    export let onClearFilter: () => void;
</script>

<div class="no-results">
    <Icon icon="mdi:alert-circle-outline" width="48" height="48" />
    <p>{$translations$.noArtistsFound} "{searchQuery}"</p>
    <button on:click={onClearFilter} class="clear-filter-button">
        {$translations$.clearFilter}
    </button>
</div>

<style>
    .no-results {
        text-align: center;
        padding: 60px 20px;
        color: var(--text-secondary, #b3b3b3);
    }

    .no-results :global(svg) {
        margin-bottom: 16px;
        opacity: 0.5;
    }

    .no-results p {
        font-size: 0.9375rem;
        margin: 0 0 16px 0;
    }

    .clear-filter-button {
        background: var(--bg-secondary, #181818);
        border: 1px solid var(--border-color, #282828);
        color: var(--text-primary, #ffffff);
        padding: 10px 20px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.875rem;
        font-weight: 500;
        transition: all 0.2s ease;
    }

    .clear-filter-button:hover {
        background: var(--bg-hover, #282828);
        border-color: var(--text-secondary, #b3b3b3);
    }
</style>
