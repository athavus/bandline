<script lang="ts">
    import Icon from "@iconify/svelte";
    import { createEventDispatcher } from "svelte";

    export let value: string = "";

    const dispatch = createEventDispatcher();

    function handleClear() {
        value = "";
        dispatch("clear");
    }
</script>

<div class="search-bar">
    <Icon icon="mdi:magnify" width="20" height="20" />
    <input
        type="text"
        bind:value
        placeholder="Pesquisar álbuns..."
        class="favorites-search-input"
    />
    {#if value}
        <button
            class="clear-search"
            on:click={handleClear}
            title="Limpar busca"
        >
            <Icon icon="mdi:close" width="18" height="18" />
        </button>
    {/if}
</div>

<style>
    .search-bar {
        flex: 1;
        min-width: 250px;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 16px;
        background: var(--bg-card);
        border-radius: 12px;
        border: 1px solid var(--border-color);
        transition: all 0.3s ease;
    }

    .search-bar:focus-within {
        border-color: var(--accent-color);
        box-shadow: 0 0 0 3px rgba(var(--accent-rgb), 0.1);
    }

    .search-bar :global(svg) {
        color: var(--text-tertiary);
        flex-shrink: 0;
    }

    .favorites-search-input {
        flex: 1;
        border: none;
        width: 50%;
        background: transparent;
        color: var(--text-primary);
        font-size: 0.95rem;
        outline: none;
    }

    .favorites-search-input::placeholder {
        color: var(--text-tertiary);
    }

    .clear-search {
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-tertiary);
        transition: color 0.2s ease;
        border-radius: 4px;
    }

    .clear-search:hover {
        color: var(--text-primary);
        background: var(--bg-tertiary);
    }

    @media (max-width: 968px) {
        .search-bar {
            width: 100%;
        }
    }
</style>
