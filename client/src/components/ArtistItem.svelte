<script lang="ts">
  import type { SearchArtistResult } from '../types/artist.ts';
  
  export let artist: SearchArtistResult;
</script>

<button class="artist-item" on:click type="button">
  {#if artist.image}
    <img src={artist.image} alt={artist.name} />
  {:else}
    <div class="no-image">?</div>
  {/if}
  
  <div class="artist-info">
    <div class="artist-name">{artist.name}</div>
    <div class="artist-details">
      {artist.total_followers.toLocaleString('pt-BR')} seguidores
      {#if artist.genres.length > 0}
        • {artist.genres.join(', ')}
      {/if}
    </div>
  </div>
</button>

<style>
  .artist-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    width: 100%;
    border: none;
    background: var(--bg-card);
    cursor: pointer;
    text-align: left;
    transition: all 0.3s ease;
  }
  
  .artist-item:hover {
    background: var(--bg-hover);
  }
  
  .artist-item img,
  .no-image {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
  }
  
  .no-image {
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--border-color);
    color: var(--text-tertiary);
    font-size: 24px;
    transition: all 0.3s ease;
  }
  
  .artist-info {
    flex: 1;
  }
  
  .artist-name {
    font-weight: 600;
    margin-bottom: 3px;
    color: var(--text-primary);
    transition: color 0.3s ease;
  }
  
  .artist-details {
    font-size: 14px;
    color: var(--text-secondary);
    transition: color 0.3s ease;
  }
</style>
