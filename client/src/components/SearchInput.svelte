<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  export let value = '';
  export let placeholder = 'Digite o nome do artista';
  
  const dispatch = createEventDispatcher();
  
  function handleInput() {
    dispatch('input', value);
  }
  
  function handleFocus() {
    dispatch('focus');
  }
  
  function handleBlur() {
    dispatch('blur');
  }
</script>

<input 
  bind:value
  on:input={handleInput}
  on:focus={handleFocus}
  on:blur={handleBlur}
  type="text" 
  {placeholder}
/>

<style>
  input {
    width: 40%;
    padding: 12px 16px;
    font-size: 16px;
    border: 2px solid var(--border-light);
    border-radius: 8px;
    background: var(--bg-input);
    color: var(--text-primary);
    transition: all 0.3s ease;
  }

  input::placeholder {
    color: var(--text-tertiary);
    opacity: 1;
  }

  input:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 3px rgba(29, 185, 84, 0.15);
  }

  input:hover {
    border-color: var(--text-tertiary);
  }
</style>
