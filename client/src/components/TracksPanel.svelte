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
    border-radius: 8px;
    padding: 40px;
    animation: slideUp 0.5s ease;
    transition: all 0.3s ease;
    box-shadow: var(--shadow-lg);
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
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 2px solid var(--border-color);
    transition: border-color 0.3s ease;
  }

  .tracks-header h3 {
    font-family: var(--font-heading);
    font-size: 1.8rem;
    font-weight: 700;
    margin: 0;
    color: var(--text-primary);
    transition: color 0.3s ease;
  }

  .close-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--bg-secondary);
    border: 2px solid var(--border-color);
    color: var(--text-secondary);
    font-size: 1.2rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    font-weight: 600;
  }

  .close-btn:hover {
    background: var(--error-color);
    color: white;
    border-color: var(--error-color);
    transform: rotate(90deg) scale(1.1);
    box-shadow: var(--shadow-md);
  }

  .tracks-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 16px;
  }

  @media (max-width: 1024px) {
    .tracks-panel {
      margin: 40px 20px 0;
      padding: 30px;
      border-radius: 8px;
    }

    .tracks-header h3 {
      font-size: 1.6rem;
    }
  }

  @media (max-width: 768px) {
    .tracks-panel {
      margin: 30px 16px 0;
      padding: 24px;
      border-radius: 8px;
    }

    .tracks-grid {
      grid-template-columns: 1fr;
    }

    .tracks-header h3 {
      font-size: 1.4rem;
    }

    .close-btn {
      width: 36px;
      height: 36px;
      font-size: 1.1rem;
    }
  }

  @media (max-width: 480px) {
    .tracks-panel {
      margin: 20px 12px 0;
      padding: 20px;
    }

    .tracks-header {
      margin-bottom: 24px;
      padding-bottom: 16px;
    }

    .tracks-header h3 {
      font-size: 1.2rem;
    }
  }
</style>
