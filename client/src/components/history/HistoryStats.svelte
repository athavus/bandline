<script lang="ts">
    import Icon from "@iconify/svelte";
    import { translations$ } from "../../lib/stores/language";

    export let totalArtists: number;
</script>

<div class="history-stats">
    <div class="stat-badge">
        <Icon icon="mdi:music" width="20" height="20" />
        <span
            >{totalArtists}
            {totalArtists === 1
                ? $translations$.artist
                : $translations$.artists}</span
        >
    </div>
</div>

<style>
    .history-stats {
        display: flex;
        gap: 12px;
    }

    .stat-badge {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        background: var(--bg-secondary, #181818);
        border: 1px solid var(--border-color, #282828);
        border-radius: 6px;
        color: var(--text-secondary, #b3b3b3);
        font-weight: 500;
        font-size: 0.875rem;
    }

    @media (max-width: 480px) {
        .stat-badge {
            font-size: 0.85rem;
            padding: 8px 14px;
        }
    }
</style>
