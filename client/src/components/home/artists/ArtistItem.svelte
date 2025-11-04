<script lang="ts">
  import type { SearchArtistResult } from "../../../types/artist.ts";
  import "./ArtistItem.css";

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
      {artist.total_followers.toLocaleString("pt-BR")} seguidores
      {#if artist.genres.length > 0}
        • {artist.genres.join(", ")}
      {/if}
    </div>
  </div>
</button>
