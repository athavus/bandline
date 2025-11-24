<script lang="ts">
    import Icon from "@iconify/svelte";
    import { createEventDispatcher } from "svelte";
    import { t } from "../../lib/stores/language";

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

<style>
    .error-message {
        text-align: center;
        color: var(--text-secondary);
        margin-top: 80px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
    }

    .error-message :global(svg:first-child) {
        color: #ff4757;
    }

    .retry-button {
        display: flex;
        align-items: center;
        gap: 8px;
        background: linear-gradient(135deg, #ff4757 0%, #ff6b81 100%);
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 0.95rem;
        font-weight: 600;
        transition: all 0.3s ease;
    }

    .retry-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(255, 71, 87, 0.4);
    }
</style>
