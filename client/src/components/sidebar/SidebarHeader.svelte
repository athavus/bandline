<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { replace } from "../../lib/router";
    const dispatch = createEventDispatcher();

    function handleClose() {
        dispatch("close");
    }
    function goHome() {
        replace("/");
    }
</script>

<div class="sidebar-header">
    <div
        class="sidebar-logo"
        role="button"
        tabindex="0"
        on:click={goHome}
        on:keydown={(e) => (e.key === "Enter" || e.key === " ") && goHome()}
    >
        <slot />
    </div>
    <button title="sidebar-close" class="sidebar-close" on:click={handleClose}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <line
                x1="18"
                y1="6"
                x2="6"
                y2="18"
                stroke="currentColor"
                stroke-width="2"
            />
            <line
                x1="6"
                y1="6"
                x2="18"
                y2="18"
                stroke="currentColor"
                stroke-width="2"
            />
        </svg>
    </button>
</div>

<style>
    .sidebar-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px;
        border-bottom: 1px solid var(--border-color);
    }

    .sidebar-logo {
        display: flex;
        align-items: center;
        gap: 12px;
        cursor: pointer;
    }

    .sidebar-close {
        background: none;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: all 0.2s ease;
    }

    .sidebar-close:hover {
        color: var(--text-primary);
        background: var(--bg-hover);
    }
</style>
