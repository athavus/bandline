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
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
</style>
