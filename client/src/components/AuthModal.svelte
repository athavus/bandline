<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { auth } from '../lib/stores/auth.ts';
  
  const dispatch = createEventDispatcher();
  
  export let open = false;
  export let mode: 'login' | 'register' = 'login';
  
  let username = '';
  let email = '';
  let password = '';
  let confirmPassword = '';
  let showPassword = false;
  let showConfirmPassword = false;
  let isLoading = false;
  let errorMessage = '';
  let successMessage = '';
  
  // Reativo para o estado do auth store
  $: authState = $auth;
  $: if ($auth.isAuthenticated) {
    handleClose();
  }
  
  // Reset form quando trocar de modo
  $: if (mode) {
    resetForm();
  }
  
  // Validação de senha para registro
  $: passwordStrength = mode === 'register' ? getPasswordStrength(password) : null;
  $: passwordsMatch = password && confirmPassword && password === confirmPassword;
  
  function resetForm() {
    username = '';
    email = '';
    password = '';
    confirmPassword = '';
    showPassword = false;
    showConfirmPassword = false;
    errorMessage = '';
    successMessage = '';
  }
  
  function getPasswordStrength(pass: string) {
    if (!pass) return { score: 0, label: '', color: '' };
    
    let score = 0;
    const checks = {
      length: pass.length >= 8,
      uppercase: /[A-Z]/.test(pass),
      lowercase: /[a-z]/.test(pass),
      number: /\d/.test(pass),
      special: /[^A-Za-z0-9]/.test(pass)
    };
    
    score = Object.values(checks).filter(Boolean).length;
    
    if (score <= 2) return { score, label: 'Fraca', color: '#ef4444' };
    if (score <= 3) return { score, label: 'Média', color: '#f59e0b' };
    if (score <= 4) return { score, label: 'Forte', color: '#10b981' };
    return { score, label: 'Muito Forte', color: '#059669' };
  }
  
  function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  async function handleLogin() {
    if (!username.trim() || !password.trim()) {
      errorMessage = 'Por favor, preencha todos os campos';
      return;
    }

    errorMessage = '';
    isLoading = true;

    const result = await auth.login(username, password);
    
    if (result.success) {
      dispatch('loginSuccess');
      handleClose();
    } else {
      errorMessage = result.error || 'Erro no login';
    }
    
    isLoading = false;
  }
  
  async function handleRegister() {
    if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      errorMessage = 'Por favor, preencha todos os campos';
      return;
    }

    if (!isValidEmail(email)) {
      errorMessage = 'Por favor, digite um email válido';
      return;
    }

    if (password.length < 8) {
      errorMessage = 'A senha deve ter pelo menos 8 caracteres';
      return;
    }

    if (!passwordsMatch) {
      errorMessage = 'As senhas não conferem';
      return;
    }

    errorMessage = '';
    successMessage = '';
    isLoading = true;

    const result = await auth.register(username, email, password);
    
    if (result.success) {
      successMessage = result.message || 'Conta criada com sucesso!';
      setTimeout(() => {
        mode = 'login';
        resetForm();
      }, 2000);
    } else {
      errorMessage = result.error || 'Erro ao criar conta';
    }
    
    isLoading = false;
  }
  
  function handleGoogleLogin() {
    auth.loginWithGoogle();
  }
  
  function handleClose() {
    if (!isLoading) {
      open = false;
      resetForm();
      dispatch('close');
    }
  }
  
  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }
  
  function switchMode() {
    mode = mode === 'login' ? 'register' : 'login';
    resetForm();
  }
</script>

{#if open}
  <div class="modal-overlay" on:click={handleBackdropClick} on:keydown={(e) => e.key === 'Escape' && handleClose()}>
    <div class="auth-card">
      <button class="close-btn" on:click={handleClose} disabled={isLoading} aria-label="Fechar">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
      
      <div class="auth-header">
        <h2>{mode === 'login' ? 'Bem-vindo de volta' : 'Criar conta'}</h2>
        <p>{mode === 'login' ? 'Entre na sua conta para continuar' : 'Preencha os dados para começar'}</p>
      </div>

      <form on:submit|preventDefault={mode === 'login' ? handleLogin : handleRegister} class="auth-form">
        <div class="form-group">
          <label for="username">Nome de usuário{mode === 'register' ? '' : ' ou email'}</label>
          <input
            id="username"
            type="text"
            bind:value={username}
            placeholder="Digite seu nome de usuário{mode === 'register' ? '' : ' ou email'}"
            disabled={isLoading}
            autocomplete="username"
          />
        </div>

        {#if mode === 'register'}
          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              type="email"
              bind:value={email}
              placeholder="Digite seu email"
              disabled={isLoading}
              autocomplete="email"
            />
          </div>
        {/if}

        <div class="form-group">
          <label for="password">Senha</label>
          <div class="password-input">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              bind:value={password}
              placeholder="Digite sua senha"
              disabled={isLoading}
              autocomplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
            <button
              type="button"
              class="password-toggle"
              on:click={() => showPassword = !showPassword}
              disabled={isLoading}
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                {#if showPassword}
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                {:else}
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                {/if}
              </svg>
            </button>
          </div>
          {#if mode === 'register' && password && passwordStrength}
            <div class="password-strength">
              <div class="strength-bar">
                <div 
                  class="strength-fill" 
                  style="width: {passwordStrength.score * 20}%; background-color: {passwordStrength.color}"
                ></div>
              </div>
              <span style="color: {passwordStrength.color}">{passwordStrength.label}</span>
            </div>
          {/if}
        </div>

        {#if mode === 'register'}
          <div class="form-group">
            <label for="confirmPassword">Confirmar senha</label>
            <div class="password-input">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                bind:value={confirmPassword}
                placeholder="Digite novamente sua senha"
                disabled={isLoading}
                autocomplete="new-password"
                class:error={confirmPassword && !passwordsMatch}
              />
              <button
                type="button"
                class="password-toggle"
                on:click={() => showConfirmPassword = !showConfirmPassword}
                disabled={isLoading}
                aria-label={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  {#if showConfirmPassword}
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  {:else}
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  {/if}
                </svg>
              </button>
            </div>
            {#if confirmPassword && !passwordsMatch}
              <div class="field-error">
                As senhas não conferem
              </div>
            {/if}
          </div>
        {/if}

        {#if successMessage}
          <div class="success-message">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            </svg>
            {successMessage}
          </div>
        {/if}

        {#if errorMessage}
          <div class="error-message">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="2"/>
              <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" stroke-width="2"/>
            </svg>
            {errorMessage}
          </div>
        {/if}

        <button type="submit" class="auth-submit-btn" disabled={isLoading}>
          {#if isLoading}
            <svg class="loading-spinner" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-dasharray="31.416" stroke-dashoffset="31.416">
                <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
                <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
            </svg>
            {mode === 'login' ? 'Entrando...' : 'Criando conta...'}
          {:else}
            {mode === 'login' ? 'Entrar' : 'Criar conta'}
          {/if}
        </button>
      </form>

      <div class="auth-divider">
        <span>ou</span>
      </div>

      <button type="button" class="google-btn" on:click={handleGoogleLogin} disabled={isLoading}>
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continuar com Google
      </button>

      <div class="auth-footer">
        <p>
          {mode === 'login' ? 'Não tem uma conta?' : 'Já tem uma conta?'}
          <button type="button" class="link-btn" on:click={switchMode}>
            {mode === 'login' ? 'Criar conta' : 'Fazer login'}
          </button>
        </p>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
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

  .auth-card {
    background: var(--bg-card);
    border: 1.5px solid var(--border-color);
    border-radius: 16px;
    padding: 40px;
    width: 100%;
    max-width: 440px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    position: relative;
    animation: slideUp 0.3s ease;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 480px) {
    .auth-card {
      padding: 24px;
      border-radius: 12px;
      max-height: 95vh;
    }
  }

  .close-btn {
    position: absolute;
    top: 16px;
    right: 16px;
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 8px;
    border-radius: 8px;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .close-btn:hover:not(:disabled) {
    color: var(--text-primary);
    background: var(--bg-hover);
  }

  .close-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .auth-header {
    text-align: center;
    margin-bottom: 32px;
    margin-top: 8px;
  }

  .auth-header h2 {
    color: var(--text-primary);
    font-size: 1.75rem;
    font-weight: 600;
    margin: 0 0 8px 0;
  }

  .auth-header p {
    color: var(--text-secondary);
    font-size: 0.95rem;
    margin: 0;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-group label {
    display: block;
    color: var(--text-primary);
    font-size: 0.9rem;
    font-weight: 500;
    margin-bottom: 8px;
  }

  .form-group input {
    width: 100%;
    padding: 12px 16px;
    background: var(--bg-primary);
    border: 1.5px solid var(--border-color);
    border-radius: 8px;
    color: var(--text-primary);
    font-size: 0.95rem;
    transition: all 0.3s ease;
    box-sizing: border-box;
  }

  .form-group input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.1);
  }

  .form-group input:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .form-group input.error {
    border-color: var(--error-color, #ef4444);
  }

  .password-input {
    position: relative;
  }

  .password-toggle {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: all 0.2s ease;
  }

  .password-toggle:hover:not(:disabled) {
    color: var(--text-primary);
    background: var(--bg-hover);
  }

  .password-toggle:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .password-strength {
    margin-top: 8px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .strength-bar {
    flex: 1;
    height: 4px;
    background: var(--border-color);
    border-radius: 2px;
    overflow: hidden;
  }

  .strength-fill {
    height: 100%;
    transition: width 0.3s ease, background-color 0.3s ease;
  }

  .password-strength span {
    font-size: 0.8rem;
    font-weight: 500;
    min-width: 80px;
  }

  .field-error {
    color: var(--error-color, #ef4444);
    font-size: 0.8rem;
    margin-top: 6px;
  }

  .success-message {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--success-color, #10b981);
    font-size: 0.85rem;
    margin-bottom: 16px;
    padding: 12px;
    background: var(--success-bg, rgba(16, 185, 129, 0.1));
    border: 1px solid var(--success-border, rgba(16, 185, 129, 0.2));
    border-radius: 6px;
  }

  .error-message {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--error-color, #ef4444);
    font-size: 0.85rem;
    margin-bottom: 16px;
    padding: 12px;
    background: var(--error-bg, rgba(239, 68, 68, 0.1));
    border: 1px solid var(--error-border, rgba(239, 68, 68, 0.2));
    border-radius: 6px;
  }

  .auth-submit-btn {
    width: 100%;
    padding: 12px 24px;
    background: var(--gradient-primary);
    border: none;
    border-radius: 8px;
    color: #ffffff;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-bottom: 24px;
  }

  .auth-submit-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  .auth-submit-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  .loading-spinner {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .auth-divider {
    position: relative;
    text-align: center;
    margin: 24px 0;
  }

  .auth-divider::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: var(--border-color);
    z-index: 0;
  }

  .auth-divider span {
    position: relative;
    background: var(--bg-card);
    color: var(--text-secondary);
    padding: 0 16px;
    font-size: 0.85rem;
    z-index: 1;
  }

  .google-btn {
    width: 100%;
    padding: 12px 24px;
    background: var(--bg-primary);
    border: 1.5px solid var(--border-color);
    border-radius: 8px;
    color: var(--text-primary);
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-bottom: 24px;
  }

  .google-btn:hover:not(:disabled) {
    border-color: var(--primary-color);
    background: var(--bg-hover);
    transform: translateY(-1px);
    box-shadow: var(--shadow-sm);
  }

  .google-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  .auth-footer {
    text-align: center;
  }

  .auth-footer p {
    color: var(--text-secondary);
    font-size: 0.9rem;
    margin: 0;
  }

  .link-btn {
    background: none;
    border: none;
    color: var(--primary-color);
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    text-decoration: underline;
    text-underline-offset: 2px;
    transition: all 0.2s ease;
  }

  .link-btn:hover {
    color: var(--primary-hover);
  }

  /* Scrollbar personalizada */
  .auth-card::-webkit-scrollbar {
    width: 8px;
  }

  .auth-card::-webkit-scrollbar-track {
    background: var(--bg-primary);
    border-radius: 4px;
  }

  .auth-card::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 4px;
  }

  .auth-card::-webkit-scrollbar-thumb:hover {
    background: var(--text-secondary);
  }
</style>
