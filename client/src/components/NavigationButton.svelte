<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let direction: 'prev' | 'next';

  const dispatch = createEventDispatcher();

  function handleClick() {
    dispatch('click');
  }
</script>

<button 
  class="nav-button {direction}" 
  on:click={handleClick} 
  {...$$restProps}
>
  {#if direction === 'prev'}
    <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  {:else}
    <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  {/if}
</button>

<style>
  .nav-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: var(--bg-secondary);
    border: 2px solid var(--border-color);
    color: var(--text-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    z-index: 5;
  }

  .nav-button.prev { left: 0; }
  .nav-button.next { right: 0; }
  
  .nav-button:hover {
    transform: translateY(-50%) scale(1.05);
    background: var(--bg-hover);
    border-color: var(--text-primary);
  }

  @media (max-width: 768px) {
    .nav-button {
      width: 50px;
      height: 50px;
    }
  }
</style>
