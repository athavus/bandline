<script lang="ts">
  export let open: boolean = false;
  export let onClose: () => void = () => {};
</script>

{#if open}
  <div class="modal-backdrop" on:click={onClose}>
    <div class="modal-content" on:click|stopPropagation>
      <button class="close-btn" on:click={onClose} aria-label="Fechar">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <slot />
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.2s ease;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .modal-content {
    background: var(--bg-card);
    padding: 2.5rem;
    border-radius: 16px;
    max-width: 800px;
    width: 90%;
    max-height: 85vh;
    overflow-y: auto;
    overflow-x: hidden;  
    position: relative;
    box-shadow: var(--shadow-lg);
    animation: slideUp 0.3s ease;
    border: 1px solid var(--bg-color);
  }

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: transparent;
    border: none;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--text-primary);
    transition: all 0.2s ease;
  }

  .close-btn:hover {
    background: var(--bg-hover);
    transform: rotate(90deg);
  }

  .close-btn:active {
    transform: rotate(90deg) scale(0.95);
  }

  /* Scrollbar customizada */
  .modal-content::-webkit-scrollbar {
    width: 8px;
  }

  .modal-content::-webkit-scrollbar-track {
    background: transparent;
  }

  .modal-content::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 4px;
  }

  .modal-content::-webkit-scrollbar-thumb:hover {
    background: var(--border-light);
  }

  /* Firefox scrollbar */
  .modal-content {
    scrollbar-width: thin;
    scrollbar-color: var(--border-color) transparent;
  }
</style>
