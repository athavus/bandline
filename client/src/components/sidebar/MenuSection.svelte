<script lang="ts">
    export let title: string | null = null;
</script>

<div class="sidebar-section">
    {#if title}
        <h3>{title}</h3>
    {/if}
    <nav class="sidebar-menu">
        <slot />
    </nav>
</div>

<style>
    .sidebar-section {
        margin-bottom: 32px;
        padding: 0 20px;
    }

    .sidebar-section h3 {
        color: var(--text-secondary);
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin: 0 0 12px 0;
    }

    .sidebar-menu {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }
</style>
