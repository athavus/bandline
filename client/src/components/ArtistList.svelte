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
    background: white;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-top: 5px;
    max-height: 300px;
    overflow-y: auto;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    z-index: 1000;
  }
</style>
