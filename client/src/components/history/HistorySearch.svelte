<script lang="ts">
    import Icon from "@iconify/svelte";
    import { translations$ } from "../../lib/stores/language";

    import "./HistorySearch.css";

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
