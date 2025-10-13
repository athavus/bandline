<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { auth } from "../lib/stores/auth.ts";

  export let open = false;

  const dispatch = createEventDispatcher();

  // Reativo para o estado de autenticação
  $: authState = $auth;

  function handleAction(action: string) {
    dispatch("action", action);
  }

  function handleOverlayClick() {
    open = false;
  }
</script>

<div class="sidebar-overlay" class:open on:click={handleOverlayClick}></div>

<aside class="sidebar" class:open>
  <div class="sidebar-header">
    <div class="sidebar-logo">
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        class="logo-icon"
      >
        <path
          d="M9 18V5l12-2v13"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <circle cx="6" cy="18" r="3" stroke="currentColor" stroke-width="2" />
        <circle cx="18" cy="16" r="3" stroke="currentColor" stroke-width="2" />
      </svg>
      <span class="logo-text">
        <span class="logo-band">Band</span><span class="logo-line">line</span>
      </span>
    </div>
    <button class="sidebar-close" on:click={() => (open = false)}>
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

  <div class="sidebar-content">
    {#if authState.isAuthenticated}
      <!-- Menu para usuários autenticados -->
      <div class="sidebar-section">
        <div class="user-info">
          <div class="user-avatar">
            {#if authState.user?.avatarUrl}
              <img
                src={authState.user.avatarUrl}
                alt={authState.user.username}
                class="avatar-image"
              />
            {:else}
              <span class="avatar-letter">
                {authState.user?.username?.charAt(0).toUpperCase() || "U"}
              </span>
            {/if}
          </div>
          <div class="user-details">
            <span class="user-name"
              >{authState.user?.username || "Usuário"}</span
            >
            <span class="user-email">{authState.user?.email || ""}</span>
          </div>
        </div>
      </div>

      <div class="sidebar-section">
        <h3>Menu</h3>
        <nav class="sidebar-menu">
          <button class="menu-item" on:click={() => handleAction("favorites")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                stroke="currentColor"
                stroke-width="2"
              />
            </svg>
            Favoritos
          </button>

          <button class="menu-item" on:click={() => handleAction("history")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="2"
              />
              <polyline
                points="12,6 12,12 16,14"
                stroke="currentColor"
                stroke-width="2"
              />
            </svg>
            Histórico
          </button>

          <button class="menu-item" on:click={() => handleAction("playlists")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M21 15V6" stroke="currentColor" stroke-width="2" />
              <path d="M21 3h-6" stroke="currentColor" stroke-width="2" />
              <path
                d="M5 17a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
                stroke="currentColor"
                stroke-width="2"
              />
              <path d="M8 14V5l13-1v9" stroke="currentColor" stroke-width="2" />
            </svg>
            Álbuns Completos
          </button>
        </nav>
      </div>

      <div class="sidebar-section">
        <h3>Conta</h3>
        <nav class="sidebar-menu">
          <button class="menu-item" on:click={() => handleAction("profile")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                stroke="currentColor"
                stroke-width="2"
              />
              <circle
                cx="12"
                cy="7"
                r="4"
                stroke="currentColor"
                stroke-width="2"
              />
            </svg>
            Perfil
          </button>

          <button class="menu-item" on:click={() => handleAction("settings")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="12"
                r="3"
                stroke="currentColor"
                stroke-width="2"
              />
              <path
                d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
                stroke="currentColor"
                stroke-width="2"
              />
            </svg>
            Configurações
          </button>

          <button
            class="menu-item danger"
            on:click={() => handleAction("logout")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
                stroke="currentColor"
                stroke-width="2"
              />
              <polyline
                points="16,17 21,12 16,7"
                stroke="currentColor"
                stroke-width="2"
              />
              <line
                x1="21"
                y1="12"
                x2="9"
                y2="12"
                stroke="currentColor"
                stroke-width="2"
              />
            </svg>
            Sair
          </button>
        </nav>
      </div>
    {:else}
      <!-- Menu para usuários não autenticados -->
      <div class="sidebar-section">
        <div class="auth-prompt">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <path
              d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
              stroke="currentColor"
              stroke-width="2"
            />
            <circle
              cx="12"
              cy="7"
              r="4"
              stroke="currentColor"
              stroke-width="2"
            />
          </svg>
          <h3>Bem-vindo!</h3>
          <p>Faça login ou crie uma conta para acessar todos os recursos</p>
        </div>
      </div>

      <div class="sidebar-section">
        <nav class="sidebar-menu">
          <button
            class="menu-item primary"
            on:click={() => handleAction("login")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"
                stroke="currentColor"
                stroke-width="2"
              />
              <polyline
                points="10,17 15,12 10,7"
                stroke="currentColor"
                stroke-width="2"
              />
              <line
                x1="15"
                y1="12"
                x2="3"
                y2="12"
                stroke="currentColor"
                stroke-width="2"
              />
            </svg>
            Fazer Login
          </button>

          <button
            class="menu-item secondary"
            on:click={() => handleAction("register")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
                stroke="currentColor"
                stroke-width="2"
              />
              <circle
                cx="8.5"
                cy="7"
                r="4"
                stroke="currentColor"
                stroke-width="2"
              />
              <line
                x1="20"
                y1="8"
                x2="20"
                y2="14"
                stroke="currentColor"
                stroke-width="2"
              />
              <line
                x1="23"
                y1="11"
                x2="17"
                y2="11"
                stroke="currentColor"
                stroke-width="2"
              />
            </svg>
            Criar Conta
          </button>
        </nav>
      </div>

      <div class="sidebar-section">
        <h3>Explorar</h3>
        <nav class="sidebar-menu">
          <button class="menu-item disabled">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle
                cx="11"
                cy="11"
                r="8"
                stroke="currentColor"
                stroke-width="2"
              />
              <path
                d="M21 21l-4.35-4.35"
                stroke="currentColor"
                stroke-width="2"
              />
            </svg>
            Buscar Artistas
          </button>

          <button class="menu-item disabled">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 18V5l12-2v13"
                stroke="currentColor"
                stroke-width="2"
              />
              <circle
                cx="6"
                cy="18"
                r="3"
                stroke="currentColor"
                stroke-width="2"
              />
              <circle
                cx="18"
                cy="16"
                r="3"
                stroke="currentColor"
                stroke-width="2"
              />
            </svg>
            Top Charts
          </button>
        </nav>
      </div>
    {/if}
  </div>
</aside>

<style>
  .sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 998;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
  }

  .sidebar-overlay.open {
    opacity: 1;
    visibility: visible;
  }

  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 280px;
    background: var(--bg-card);
    border-right: 1.5px solid var(--border-color);
    z-index: 999;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    display: flex;
    flex-direction: column;
    box-shadow: var(--shadow-lg);
  }

  .sidebar.open {
    transform: translateX(0);
  }

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
  }

  .logo-icon {
    color: var(--accent-color);
    filter: drop-shadow(0 2px 6px rgba(var(--accent-rgb), 0.4));
    animation: iconPulse 2s ease-in-out infinite;
  }

  @keyframes iconPulse {
    0%,
    100% {
      transform: scale(1);
      filter: drop-shadow(0 2px 6px rgba(var(--accent-rgb), 0.4));
    }
    50% {
      transform: scale(1.05);
      filter: drop-shadow(0 3px 8px rgba(var(--accent-rgb), 0.6));
    }
  }

  .logo-text {
    font-family: var(--font-heading);
    font-size: 1.3rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1;
  }

  .logo-band {
    background: linear-gradient(
      135deg,
      var(--accent-color) 0%,
      var(--accent-hover) 100%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .logo-line {
    color: var(--text-primary);
    font-weight: 700;
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

  .sidebar-content {
    flex: 1;
    padding: 20px 0;
    overflow-y: auto;
  }

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

  .user-info {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    background: var(--bg-primary);
    border-radius: 12px;
    border: 1px solid var(--border-color);
  }

  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--gradient-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
    font-size: 1.1rem;
    overflow: hidden;
    flex-shrink: 0;
  }

  .avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }

  .avatar-letter {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .user-details {
    flex: 1;
    min-width: 0;
  }

  .user-name {
    display: block;
    color: var(--text-primary);
    font-weight: 500;
    font-size: 0.95rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .user-email {
    display: block;
    color: var(--text-secondary);
    font-size: 0.8rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .auth-prompt {
    text-align: center;
    padding: 20px 16px;
  }

  .auth-prompt svg {
    color: var(--text-secondary);
    margin-bottom: 16px;
  }

  .auth-prompt h3 {
    color: var(--text-primary);
    font-size: 1.2rem;
    font-weight: 600;
    margin: 0 0 8px 0;
    text-transform: none;
    letter-spacing: normal;
  }

  .auth-prompt p {
    color: var(--text-secondary);
    font-size: 0.9rem;
    line-height: 1.4;
    margin: 0;
  }

  .sidebar-menu {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

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

  @media (max-width: 768px) {
    .sidebar-overlay.open {
      display: block;
    }
  }

  /* Variáveis CSS adicionais */
  :root {
    --error-color: #ef4444;
  }
</style>
