<script lang="ts">
    import Icon from "@iconify/svelte";

    export let totalAlbums: number;
    export let filteredCount: number;
</script>

<div class="playlists-stats">
    <span>
        {filteredCount} de {totalAlbums}
        {totalAlbums === 1 ? "álbum" : "álbuns"}
    </span>
</div>

<style>
    .playlists-stats {
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

    .playlists-stats :global(svg) {
        color: #1db954;
    }

    @media (max-width: 968px) {
        .playlists-stats {
            width: 100%;
            justify-content: center;
        }
    }

    @media (max-width: 480px) {
        .playlists-stats {
            padding: 10px 16px;
            font-size: 0.9rem;
        }
    }
</style>
