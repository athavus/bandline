<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { SpotifyAlbumTracks } from '../types/tracks.ts';
  import TrackCard from './TrackCard.svelte';
  import LoadingSpinner from './LoadingSpinner.svelte';

  export let album: any;
  export let albumTracks: SpotifyAlbumTracks | null = null;
  export let loading: boolean = false;

  const dispatch = createEventDispatcher();

  function handleClose() {
    dispatch('close');
  }
</script>

<div class="tracks-panel">
  {#if loading}
    <LoadingSpinner text="Carregando faixas..." small={true} />
  {:else if albumTracks?.items}
    <div class="tracks-header">
      <h3>{album.name}</h3>
      <button class="close-btn" on:click={handleClose}>✕</button>
    </div>
    <div class="tracks-grid">
      {#each albumTracks.items as track}
        <TrackCard {track} />
      {/each}
    </div>
  {/if}
</div>

<style>
  .tracks-panel {
    margin: 60px 80px 0;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 30px;
    padding: 50px;
    animation: slideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    transition: all 0.3s ease;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(40px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .tracks-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 35px;
    padding-bottom: 25px;
    border-bottom: 2px solid var(--border-color);
    transition: border-color 0.3s ease;
  }

  .tracks-header h3 {
    font-size: 2rem;
    font-weight: 900;
    margin: 0;
    color: var(--text-primary);
    transition: color 0.3s ease;
  }

  .close-btn {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    color: var(--text-secondary);
    font-size: 1.4rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  }

  .close-btn:hover {
    background: var(--text-primary);
    color: var(--bg-card);
    border-color: var(--text-primary);
    transform: rotate(90deg);
  }

  .tracks-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 16px;
  }

  @media (max-width: 1024px) {
    .tracks-panel {
      margin: 40px 20px 0;
      padding: 30px;
    }
  }

  @media (max-width: 768px) {
    .tracks-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
