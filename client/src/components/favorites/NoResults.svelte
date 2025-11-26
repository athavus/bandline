<script lang="ts">
    import Icon from "@iconify/svelte";

    export let searchQuery: string;
</script>

<div class="no-results">
    <Icon icon="mdi:album" width="48" height="48" />
    <p>Nenhum álbum encontrado com "{searchQuery}"</p>
</div>

<style>
    .no-results {
        text-align: center;
        padding: 80px 20px;
        color: var(--text-secondary);
    }

    .no-results :global(svg) {
        color: var(--text-tertiary);
        margin-bottom: 16px;
    }

    .no-results p {
        font-size: 1rem;
        margin: 0;
    }
</style>
