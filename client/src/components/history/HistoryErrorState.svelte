<script lang="ts">
    import Icon from "@iconify/svelte";
    import { translations$ } from "../../lib/stores/language";

    import "./HistoryErrorState.css";

    export let error: string;
    export let onRetry: () => void;
</script>

<div class="error-message">
    <div class="error-icon-wrapper">
        <Icon icon="mdi:alert-circle" width="64" height="64" />
    </div>
    <h3>{$translations$.errorOccurred}</h3>
    <p>{error}</p>
    <button on:click={onRetry} class="retry-button">
        <Icon icon="mdi:refresh" width="20" height="20" />
        {$translations$.retry}
    </button>
</div>
