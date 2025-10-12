<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { auth } from '../lib/stores/auth.ts';
  import Login from './Login.svelte';
  import Register from './Register.svelte';
  import Modal from './Modal.svelte';

  const dispatch = createEventDispatcher();

  export let open = false;
  export let mode: 'login' | 'register' = 'login';

  let currentMode = mode;

  // Reativo para escutar mudanças no auth store
  $: if ($auth.isAuthenticated) {
    handleClose();
  }

  function handleClose() {
    open = false;
    dispatch('close');
  }

  function handleLoginSuccess() {
    dispatch('loginSuccess');
    handleClose();
  }

  function handleSwitchToRegister() {
    currentMode = 'register';
  }

  function handleSwitchToLogin() {
    currentMode = 'login';
  }

  // Reset do modo quando o modal abrir
  $: if (open) {
    currentMode = mode;
  }
</script>

<Modal {open} onClose={handleClose} class="auth-modal">
  <div class="auth-modal-content">
    {#if currentMode === 'login'}
      <Login 
        on:loginSuccess={handleLoginSuccess}
        on:switchToRegister={handleSwitchToRegister}
      />
    {:else}
      <Register 
        on:switchToLogin={handleSwitchToLogin}
      />
    {/if}
  </div>
</Modal>

<style>
  :global(.auth-modal .modal-content) {
    padding: 0;
    background: transparent;
    border: none;
    box-shadow: none;
  }

  .auth-modal-content {
    width: 100%;
  }

  :global(.auth-modal .auth-container) {
    min-height: auto;
    padding: 0;
  }
</style>

