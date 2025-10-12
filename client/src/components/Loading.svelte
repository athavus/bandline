<script lang="ts">
  export let message = 'Carregando...';
</script>

<div class="loading">
  <div class="spinner-container">
    <div class="spinner"></div>
    <div class="spinner-ring"></div>
  </div>
  <p>{message}</p>
</div>

<style>
  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 40px;
    background: var(--bg-card);
    border-radius: 8px;
    border: 1px solid var(--border-color);
    box-shadow: var(--shadow-lg);
    max-width: 300px;
    margin: 0 auto;
  }
  
  .spinner-container {
    position: relative;
    width: 50px;
    height: 50px;
  }
  
  .spinner {
    width: 50px;
    height: 50px;
    border: 3px solid var(--border-color);
    border-top: 3px solid var(--accent-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    position: relative;
    z-index: 2;
  }

  .spinner-ring {
    position: absolute;
    top: -5px;
    left: -5px;
    width: 60px;
    height: 60px;
    border: 2px solid transparent;
    border-top: 2px solid rgba(29, 185, 84, 0.3);
    border-radius: 50%;
    animation: spin 1.5s linear infinite reverse;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  p {
    margin: 0;
    color: var(--text-secondary);
    font-family: var(--font-primary);
    font-size: 1rem;
    font-weight: 500;
    text-align: center;
    transition: color 0.3s ease;
  }

  @media (max-width: 768px) {
    .loading {
      padding: 30px 20px;
      gap: 16px;
    }

    .spinner-container {
      width: 40px;
      height: 40px;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border-width: 2px;
    }

    .spinner-ring {
      top: -4px;
      left: -4px;
      width: 48px;
      height: 48px;
      border-width: 1px;
    }

    p {
      font-size: 0.9rem;
    }
  }
</style>
