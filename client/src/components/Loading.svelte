<script lang="ts">
  export let message = 'Carregando...';
</script>

<div class="loading">
  <div class="spinner"></div>
  <p>{message}</p>
</div>

<style>
  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    padding: 30px;
  }
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid var(--border-color);
    border-top: 4px solid var(--accent-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  p {
    margin: 0;
    color: var(--text-secondary);
    font-size: 16px;
    transition: color 0.3s ease;
  }
</style>
