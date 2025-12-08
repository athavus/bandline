<script lang="ts">
    import Icon from "@iconify/svelte";

    export let totalFavorites: number;
    export let filteredCount: number;
</script>

<div class="favorites-stats">
    <Icon icon="mdi:heart" width="20" height="20" />
    <span>
        {filteredCount} de {totalFavorites}
        {totalFavorites === 1 ? "álbum" : "álbuns"}
    </span>
</div>

<style>
    .favorites-stats {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 20px;
        background: var(--bg-card);
        border-radius: 12px;
        backdrop-filter: blur(10px);
        border: 1px solid var(--border-color);
        color: var(--text-primary);
        font-size: 0.95rem;
        box-shadow: var(--shadow-sm);
        white-space: nowrap;
    }

    .favorites-stats :global(svg) {
        color: #ff4757;
    }

    @media (max-width: 968px) {
        .favorites-stats {
            width: 100%;
            justify-content: center;
        }
    }

    @media (max-width: 480px) {
        .favorites-stats {
            padding: 10px 16px;
            font-size: 0.85rem;
            width: 100%;
            box-sizing: border-box;
            justify-content: center;
        }

        .favorites-stats :global(svg) {
            width: 16px;
            height: 16px;
        }
    }
</style>
