<script lang="ts">
  export let onLogin: () => void;
  export let onRegister: () => void;
</script>

<div class="welcome-section">
  <h2>Descubra seus artistas favoritos</h2>
  <p>Faça login ou crie uma conta para acessar nossa plataforma de descoberta musical</p>
  <div class="welcome-buttons">
    <button class="primary-btn" on:click={onLogin}>Fazer Login</button>
    <button class="secondary-btn" on:click={onRegister}>Criar Conta</button>
  </div>
  </div>

<style>
  .welcome-section { text-align: center; max-width: 600px; margin: 40px auto; padding: 40px 24px; background: var(--bg-card); border-radius: 16px; border: 1px solid var(--border-color); box-shadow: var(--shadow-lg); }
  .welcome-section h2 { color: var(--text-primary); font-family: var(--font-heading); font-size: 2.5rem; font-weight: 700; margin: 0 0 20px 0; }
  .welcome-section p { color: var(--text-secondary); font-family: var(--font-primary); font-size: 1.1rem; line-height: 1.6; margin: 0 0 32px 0; }
  .welcome-buttons { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
  .primary-btn, .secondary-btn { padding: 14px 32px; border-radius: 8px; font-family: var(--font-primary); font-size: 0.95rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease; border: 1px solid; }
  .primary-btn { background: var(--accent-color); border-color: var(--accent-color); color: white; box-shadow: var(--shadow-sm); }
  .primary-btn:hover { background: var(--accent-hover); border-color: var(--accent-hover); transform: translateY(-2px); box-shadow: var(--shadow-md); }
  .secondary-btn { background: transparent; border-color: var(--border-color); color: var(--text-primary); }
  .secondary-btn:hover { border-color: var(--accent-color); background: var(--bg-hover); transform: translateY(-1px); box-shadow: var(--shadow-sm); }

  @media (max-width: 768px) {
    .welcome-section { margin: 30px 20px; padding: 30px 20px; border-radius: 12px; }
    .welcome-section h2 { font-size: 2rem; }
    .welcome-section p { font-size: 1rem; }
    .welcome-buttons { flex-direction: column; align-items: center; gap: 12px; }
    .primary-btn, .secondary-btn { width: 100%; max-width: 280px; padding: 12px 24px; }
  }

  @media (max-width: 480px) {
    .welcome-section { margin: 20px 16px; padding: 24px 16px; }
    .welcome-section h2 { font-size: 1.8rem; }
    .welcome-section p { font-size: 0.95rem; }
    .primary-btn, .secondary-btn { padding: 12px 20px; font-size: 0.9rem; }
  }
</style>


