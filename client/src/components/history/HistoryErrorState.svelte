<script lang="ts">
    import Icon from "@iconify/svelte";
    import { translations$ } from "../../lib/stores/language";

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

<style>
    .error-message {
        text-align: center;
        margin: 80px auto;
        padding: 40px;
        max-width: 500px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
    }

    .error-icon-wrapper {
        margin-bottom: 8px;
        color: #ff4757;
        opacity: 0.6;
    }

    .error-message h3 {
        font-size: 1.25rem;
        color: var(--text-primary, #ffffff);
        margin: 0;
        font-weight: 600;
    }

    .error-message p {
        font-size: 0.9375rem;
        margin: 0;
        color: var(--text-secondary, #b3b3b3);
        line-height: 1.5;
    }

    .retry-button {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: var(--accent-color, #1db954);
        color: white;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 6px;
        font-weight: 600;
        font-size: 0.9375rem;
        margin-top: 8px;
        transition: all 0.2s ease;
        border: none;
        cursor: pointer;
    }

    .retry-button:hover {
        background: var(--accent-hover, #1ed760);
    }

    @media (max-width: 768px) {
        .error-message {
            margin: 60px auto;
            padding: 40px 24px;
        }

        .error-message h3 {
            font-size: 1.5rem;
        }
    }
</style>
