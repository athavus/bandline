<script lang="ts">
    import Icon from "@iconify/svelte";
    import { translations$ } from "../../lib/stores/language";
</script>

<div class="empty-state">
    <div class="empty-icon-wrapper">
        <Icon icon="mdi:music-note-off" width="80" height="80" />
    </div>
    <h3>{$translations$.historyEmpty}</h3>
    <p>{$translations$.historyEmptyDescription}</p>
    <a href="/" class="explore-button">
        <Icon icon="mdi:magnify" width="20" height="20" />
        {$translations$.discoverArtists}
    </a>
</div>

<style>
    .empty-state {
        text-align: center;
        margin: 80px auto;
        padding: 40px;
        max-width: 500px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
    }

    .empty-icon-wrapper {
        margin-bottom: 8px;
        color: var(--text-secondary, #b3b3b3);
        opacity: 0.4;
    }

    .empty-state h3 {
        font-size: 1.25rem;
        color: var(--text-primary, #ffffff);
        margin: 0;
        font-weight: 600;
    }

    .empty-state p {
        font-size: 0.9375rem;
        margin: 0;
        color: var(--text-secondary, #b3b3b3);
        line-height: 1.5;
    }

    .explore-button {
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
    }

    .explore-button:hover {
        background: var(--accent-hover, #1ed760);
    }

    @media (max-width: 768px) {
        .empty-state {
            margin: 60px auto;
            padding: 40px 24px;
        }

        .empty-state h3 {
            font-size: 1.5rem;
        }
    }
</style>
