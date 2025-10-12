<script lang="ts">
  export let text: string;
  export let small: boolean = false;
</script>

<div class="loading">
  <div class="loading-spinner {small ? 'small' : ''}"></div>
  <p>{text}</p>
</div>

<style>
  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px;
    color: var(--text-primary);
    transition: color 0.3s ease;
  }

  .loading-spinner {
    width: 50px;
    height: 50px;
    border: 4px solid var(--border-color);
    border-top: 4px solid var(--text-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 25px;
  }

  .loading-spinner.small {
    width: 30px;
    height: 30px;
    border-width: 3px;
    margin-bottom: 15px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .loading p {
    color: var(--text-secondary);
    transition: color 0.3s ease;
  }
</style>
