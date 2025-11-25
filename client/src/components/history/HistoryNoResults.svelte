<script lang="ts">
    import Icon from "@iconify/svelte";
    import { translations$ } from "../../lib/stores/language";

    import "./HistoryNoResults.css";

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
