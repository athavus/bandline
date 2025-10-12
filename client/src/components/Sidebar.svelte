<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let open = false;

  const dispatch = createEventDispatcher();

  const menuItems = [
    { id: "profile", label: "Perfil", icon: "user" },
    { id: "history", label: "Histórico de Pesquisas", icon: "clock" },
    { id: "fuzzy", label: "Fuzzy Match", icon: "shuffle" },
    { id: "listened", label: "Álbuns Ouvidos", icon: "disc" },
  ];

  function handleItemClick(id: string) {
    dispatch("action", id);
  }

  function getIconPath(icon: string): string {
    const icons = {
      user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
      clock:
        "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2",
      shuffle: "M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5",
      disc: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
    };
    return icons[icon] || icons.user;
  }
</script>

<aside class="sidebar" class:open>
  <div class="sidebar-header">
    <h2>Menu</h2>
  </div>

  <nav class="sidebar-nav">
    {#each menuItems as item}
      <button class="nav-item" on:click={() => handleItemClick(item.id)}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d={getIconPath(item.icon)} />
        </svg>
        <span>{item.label}</span>
      </button>
    {/each}
  </nav>
</aside>

{#if open}
  <div class="sidebar-overlay" on:click={() => (open = false)}></div>
{/if}

<style>
  .sidebar {
    position: fixed;
    top: 0;
    left: -280px;
    width: 280px;
    height: 100vh;
    background: var(--bg-card);
    border-right: 1.5px solid var(--border-color);
    transition: left 0.3s ease;
    z-index: 1000;
    overflow-y: auto;
    box-shadow: var(--shadow-lg);
  }

  .sidebar.open {
    left: 0;
  }

  .sidebar-header {
    padding: 24px 20px;
    border-bottom: 1.5px solid var(--border-color);
    background: var(--bg-secondary);
  }

  .sidebar-header h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .sidebar-nav {
    padding: 16px 0;
  }

  .nav-item {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 20px;
    background: transparent;
    border: none;
    color: var(--text-primary);
    font-size: 0.95rem;
    font-weight: 500;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .nav-item:hover {
    background: var(--bg-hover);
    color: var(--accent-color);
  }

  .nav-item svg {
    flex-shrink: 0;
    transition: transform 0.2s ease;
  }

  .nav-item:hover svg {
    transform: scale(1.1);
  }

  .sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    backdrop-filter: blur(2px);
  }

  @media (max-width: 768px) {
    .sidebar {
      width: 100%;
      left: -100%;
    }
  }
</style>
