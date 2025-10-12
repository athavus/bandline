<script lang="ts">
  import type { SpotifyArtist } from '../types/artist.ts';
  export let artist: SpotifyArtist;
  // Evento opcional para mostrar linha do tempo
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  function showTimeline() {
    dispatch('showTimeline');
  }
</script>

<div class="artist-data">
  <h2>{artist.name}</h2>
  {#if artist.image}
    <img src={artist.image} alt={artist.name} class="artist-image" />
  {/if}

  <div class="info-grid">
    <div class="info-item">
      <span class="label">ID:</span>
      <span class="value">{artist.id}</span>
    </div>
    <div class="info-item">
      <span class="label">Popularidade:</span>
      <span class="value">{artist.popularity}/100</span>
    </div>
    <div class="info-item">
      <span class="label">Seguidores:</span>
      <span class="value">{artist.total_followers?.toLocaleString('pt-BR') ?? "—"}</span>
    </div>
    {#if artist.genres.length > 0}
      <div class="info-item full-width">
        <span class="label">Gêneros:</span>
        <span class="value">{artist.genres.join(', ')}</span>
      </div>
    {/if}
  </div>
</div>

<style>
  .artist-data {
    width: 95%; 
    margin-top: 30px;
    padding: 20px;
    border: 1px solid var(--border-color);
    border-radius: 10px;
    background: var(--bg-card);
    transition: all 0.3s ease;
  }
  
  h2 {
    margin: 0 0 20px 0;
    color: var(--text-primary);
    transition: color 0.3s ease;
  }
  
  .artist-image {
    width: 200px;
    height: 200px;
    border-radius: 10px;
    object-fit: cover;
    margin-bottom: 20px;
  }
  
  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
  }
  
  .info-item {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  
  .full-width {
    grid-column: 1 / -1;
  }
  
  .label {
    font-size: 14px;
    color: var(--text-secondary);
    font-weight: 500;
    transition: color 0.3s ease;
  }
  
  .value {
    font-size: 16px;
    color: var(--text-primary);
    transition: color 0.3s ease;
  }

  .timeline-btn {
    margin-top: 20px;
    padding: 10px 18px;
    background: var(--text-color, #222);
    color: var(--bg-color, #fff);
    border: none;
    border-radius: 6px;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
  }
  .timeline-btn:hover {
    background: var(--bg-color, #fff);
    color: var(--text-color, #222);
    border: 1px solid var(--text-color, #222);
  }
</style>
