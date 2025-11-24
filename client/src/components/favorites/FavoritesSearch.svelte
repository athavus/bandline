<script lang="ts">
    import Icon from "@iconify/svelte";
    import { createEventDispatcher } from "svelte";

    import "./FavoritesSearch.css";

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
