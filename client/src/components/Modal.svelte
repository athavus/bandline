<script lang="ts">
  export let open: boolean;
  export let onClose: () => void;
</script>

{#if open}
  <div class="modal-backdrop" on:click={onClose}>
    <div class="modal-content" on:click|stopPropagation>
      <button class="close-btn" on:click={onClose}>×</button>
      <slot />
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  .modal-content {
    background: #fff;
    padding: 2rem;
    border-radius: 8px;
    max-width: 600px;
    width: 90%;
    position: relative;
  }
  .close-btn {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: transparent;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
  }
</style>
