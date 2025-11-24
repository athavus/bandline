<script lang="ts">
    import Icon from "@iconify/svelte";
    import { createEventDispatcher } from "svelte";
    import { t } from "../../lib/stores/language";

    import "./ErrorState.css";

    export let message: string;

    const dispatch = createEventDispatcher();

    function handleRetry() {
        dispatch("retry");
    }
</script>

<div class="error-message">
    <Icon icon="mdi:alert-circle" width="48" height="48" />
    <p>{message}</p>
    <button on:click={handleRetry} class="retry-button">
        <Icon icon="mdi:refresh" width="20" height="20" />
        {t("retry")}
    </button>
</div>
