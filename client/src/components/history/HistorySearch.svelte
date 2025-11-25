<script lang="ts">
    import Icon from "@iconify/svelte";
    import { translations$ } from "../../lib/stores/language";

    export let searchQuery: string;
    export let onClearSearch: () => void;
</script>

<div class="history-search-bar">
    <Icon icon="mdi:magnify" width="20" height="20" />
    <input
        type="text"
        bind:value={searchQuery}
        placeholder={$translations$.searchArtistsHistory}
        class="history-search-input"
    />
    {#if searchQuery}
        <button
            class="clear-search"
            on:click={onClearSearch}
            title={$translations$.clearSearch}
        >
            <Icon icon="mdi:close" width="18" height="18" />
        </button>
    {/if}
</div>

<style>
    .history-search-bar {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        background: var(--bg-secondary, #181818);
        border: 1px solid var(--border-color, #282828);
        border-radius: 6px;
        flex: 1;
        transition: border-color 0.2s ease;
    }

    .history-search-bar:focus-within {
        border-color: var(--text-secondary, #b3b3b3);
    }

    .history-search-bar :global(svg) {
        color: var(--text-secondary, #b3b3b3);
        flex-shrink: 0;
    }

    .history-search-input {
        flex: 1;
        background: transparent;
        border: none;
        outline: none;
        color: var(--text-primary, #ffffff);
        font-size: 0.875rem;
        font-family: inherit;
    }

    .history-search-input::placeholder {
        color: var(--text-secondary, #b3b3b3);
        opacity: 0.6;
    }

    .clear-search {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 4px;
        background: transparent;
        border: none;
        color: var(--text-secondary, #b3b3b3);
        cursor: pointer;
        border-radius: 4px;
        transition: all 0.2s ease;
    }

    .clear-search:hover {
        background: var(--bg-hover, #282828);
        color: var(--text-primary, #ffffff);
    }
</style>
