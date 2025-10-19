<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let icon: string;
  export let label: string;
  export let variant: "default" | "primary" | "secondary" | "danger" =
    "default";
  export let disabled = false;

  const dispatch = createEventDispatcher();

  function handleClick() {
    if (!disabled) {
      dispatch("click");
    }
  }
</script>

<button
  class="menu-item"
  class:primary={variant === "primary"}
  class:secondary={variant === "secondary"}
  class:danger={variant === "danger"}
  class:disabled
  on:click={handleClick}
>
  {@html icon}
  {label}
</button>

<style>
  .menu-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: none;
    border: none;
    border-radius: 8px;
    color: var(--text-primary);
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;
    width: 100%;
  }

  .menu-item :global(svg) {
    flex-shrink: 0;
  }

  .menu-item:hover:not(.disabled) {
    background: var(--bg-hover);
    color: var(--primary-color);
  }

  .menu-item.primary {
    background: var(--gradient-primary);
    color: white;
    margin-bottom: 8px;
  }

  .menu-item.primary:hover {
    background: var(--gradient-primary);
    transform: translateY(-1px);
    box-shadow: var(--shadow-sm);
  }

  .menu-item.secondary {
    background: var(--bg-primary);
    border: 1.5px solid var(--border-color);
  }

  .menu-item.secondary:hover {
    border-color: var(--primary-color);
    background: var(--bg-hover);
  }

  .menu-item.danger:hover {
    background: rgba(239, 68, 68, 0.1);
    color: var(--error-color);
  }

  .menu-item.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .menu-item.disabled:hover {
    background: none;
    color: var(--text-primary);
  }

  :root {
    --error-color: #ef4444;
  }
</style>
