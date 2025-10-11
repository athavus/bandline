<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import ArtistItem from "./ArtistItem.svelte";
  import type { SearchArtistResult } from "../types/artist";
  
  export let artists: SearchArtistResult[] = []
  export let show = false;
  
  const dispatch = createEventDispatcher();
  
  function handleSelect(artist: SearchArtistResult) {
    dispatch('select', artist);
  }
</script>

{#if show && artists.length > 0}
  <div class="overlay">
    {#each artists as artist}
      <ArtistItem {artist} on:click={() => handleSelect(artist)} />
    {/each}
  </div>
{/if}

<style>
  .overlay {
    position: absolute;
    top: 100%;
    left: 30%;
    right: 0;
    width: 40%;
    background: var(--bg-card);
    border: 1px solid var(--border-light);
    border-radius: 5px;
    margin-top: 5px;
    max-height: 300px;
    overflow-y: auto;
    box-shadow: var(--shadow-md);
    z-index: 1000;
    transition: all 0.3s ease;
  }
  
  /* Scrollbar customizada */
  .overlay::-webkit-scrollbar {
    width: 8px;
  }
  
  .overlay::-webkit-scrollbar-track {
    background: var(--bg-secondary);
    border-radius: 4px;
  }
  
  .overlay::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 4px;
  }
  
  .overlay::-webkit-scrollbar-thumb:hover {
    background: var(--text-tertiary);
  }
</style>
