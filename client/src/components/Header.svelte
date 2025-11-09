<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import ThemeButton from "./utils/ThemeButton.svelte";
  import ThemePaletteButton from "./utils/ThemePaletteButton.svelte";
  import LanguageSelector from "./utils/LanguageSelector.svelte";

  import { auth } from "../lib/stores/auth";
  import { t } from "../lib/stores/language";

  export let sidebarOpen = false;
  $: authState = $auth;

  const dispatch = createEventDispatcher();

  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
  }

  function handleLogout() {
    dispatch("logout");
  }
</script>

<header class="app-header">
  <div class="header-left">
    {#if !sidebarOpen}
      <button
        class="menu-toggle"
        on:click={toggleSidebar}
        aria-label="Toggle menu"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 12H21M3 6H21M3 18H21"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </button>
    {/if}
    <ThemeButton />
    <ThemePaletteButton />
  </div>

  <div class="header-right">
    <LanguageSelector />
    {#if authState.isAuthenticated}
      <div class="user-indicator">
        <span class="user-welcome"
          >{t("hello")}, {authState.user?.username || t("user")}!</span
        >
        <button class="logout-btn" on:click={() => auth.logout()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <polyline
              points="16,17 21,12 16,7"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <line
              x1="21"
              y1="12"
              x2="9"
              y2="12"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    {/if}
  </div>
</header>

<style>
  .app-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border-color);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .menu-toggle {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    color: var(--text-primary);
    box-shadow: var(--shadow-sm);
  }

  .menu-toggle:hover {
    background: var(--bg-hover);
    border-color: var(--accent-color);
    transform: scale(1.05);
  }

  .user-indicator {
    display: flex;
    align-items: center;
    gap: 12px;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 8px 16px;
    box-shadow: var(--shadow-sm);
  }

  .user-welcome {
    color: var(--text-primary);
    font-family: var(--font-primary);
    font-size: 0.9rem;
    font-weight: 500;
  }

  .logout-btn {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
  }

  .logout-btn:hover {
    color: var(--error-color);
    background: var(--bg-hover);
    transform: scale(1.1);
  }
  @media (max-width: 768px) {
    .app-header {
      padding: 16px 20px;
    }

    .menu-toggle {
      width: 36px;
      height: 36px;
    }

    .user-indicator {
      padding: 6px 12px;
    }
  }

  @media (max-width: 480px) {
    .app-header {
      padding: 12px 16px;
    }
  }
</style>
