<script lang="ts">
  import type { SpotifyArtist } from '../types/artist.ts';
  export let artist: SpotifyArtist;
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
      <span class="value">{artist.total_followers.toLocaleString('pt-BR')}</span>
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
    width: 50%; 
    margin-top: 30px;
    margin-bottom: 30px;
    padding: 20px;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    background: #fafafa;
  }
  
  h2 {
    margin: 0 0 20px 0;
    color: #333;
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
    color: #666;
    font-weight: 500;
  }
  
  .value {
    font-size: 16px;
    color: #333;
  }
</style>
