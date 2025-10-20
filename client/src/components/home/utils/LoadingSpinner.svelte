<script lang="ts">
  export let text: string;
  export let small: boolean = false;
</script>

<div class="loading">
  <div class="spinner-container">
    <div class="loading-spinner {small ? 'small' : ''}"></div>
    <div class="spinner-ring {small ? 'small' : ''}"></div>
  </div>
  <p>{text}</p>
</div>

<style>
  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 40px;
    color: var(--text-primary);
    transition: color 0.3s ease;
    background: var(--bg-card);
    border-radius: 8px;
    border: 1px solid var(--border-color);
    box-shadow: var(--shadow-lg);
    max-width: 400px;
    margin: 0 auto;
  }

  .spinner-container {
    position: relative;
    width: 50px;
    height: 50px;
    margin-bottom: 25px;
  }

  .loading-spinner {
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

  .loading-spinner.small {
    width: 30px;
    height: 30px;
    border-width: 2px;
  }

  .spinner-ring.small {
    top: -3px;
    left: -3px;
    width: 36px;
    height: 36px;
    border-width: 1px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .loading p {
    color: var(--text-secondary);
    font-family: var(--font-primary);
    font-size: 1rem;
    font-weight: 500;
    text-align: center;
    margin: 0;
    transition: color 0.3s ease;
  }

  @media (max-width: 768px) {
    .loading {
      padding: 40px 20px;
    }

    .spinner-container {
      width: 40px;
      height: 40px;
      margin-bottom: 20px;
    }

    .loading-spinner {
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

    .loading p {
      font-size: 0.9rem;
    }
  }
</style>
