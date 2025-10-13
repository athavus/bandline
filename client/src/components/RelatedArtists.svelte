<script lang="ts">
  import type { SearchArtistResult } from "../types/artist.ts";
  import { createEventDispatcher } from "svelte";

  export let relatedArtists: SearchArtistResult[] = [];
  export let mainArtistId: string = "";

  const dispatch = createEventDispatcher();

  // Dados mockados para demonstração - em produção viriam da API
  const mockRelatedArtists: SearchArtistResult[] = [
    {
      id: "1",
      name: "Arctic Monkeys",
      image: "https://i.scdn.co/image/ab6761610000e5eb5a00969a4698c3132a15fbb0",
      popularity: 85,
      genres: ["indie rock", "alternative rock"],
      total_followers: 12000000
    },
    {
      id: "2", 
      name: "Interpol",
      image: "https://i.scdn.co/image/ab6761610000e5eb5a00969a4698c3132a15fbb0",
      popularity: 78,
      genres: ["indie rock", "post-punk revival"],
      total_followers: 8500000
    },
    {
      id: "3",
      name: "The White Stripes",
      image: "https://i.scdn.co/image/ab6761610000e5eb5a00969a4698c3132a15fbb0", 
      popularity: 82,
      genres: ["garage rock", "blues rock"],
      total_followers: 15000000
    },
    {
      id: "4",
      name: "Franz Ferdinand",
      image: "https://i.scdn.co/image/ab6761610000e5eb5a00969a4698c3132a15fbb0",
      popularity: 75,
      genres: ["indie rock", "dance-punk"],
      total_followers: 6500000
    }
  ];

  // Usar dados mockados se não houver dados reais
  $: displayArtists = relatedArtists.length > 0 ? relatedArtists : mockRelatedArtists;

  function handleArtistClick(artist: SearchArtistResult) {
    dispatch('selectArtist', artist);
  }
</script>

<div class="related-artists-container">
  <h3 class="section-title">Artistas Relacionados</h3>
  
  <!-- Linha conectora principal -->
  <div class="main-connection">
    <div class="connection-line"></div>
    <div class="connection-dot"></div>
  </div>

  <!-- Lista de artistas relacionados -->
  <div class="artists-list">
    {#each displayArtists as artist, index}
      <div 
        class="artist-item"
        on:click={() => handleArtistClick(artist)}
        role="button"
        tabindex="0"
        on:keydown={(e) => e.key === 'Enter' && handleArtistClick(artist)}
      >
        <!-- Linha conectora individual -->
        <div class="item-connection"></div>
        
        <!-- Card do artista -->
        <div class="artist-card">
          <div class="artist-image">
            {#if artist.image}
              <img src={artist.image} alt={artist.name} />
            {:else}
              <div class="placeholder-image">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.1 3.9 23 5 23H19C20.1 23 21 22.1 21 21V9H21ZM19 21H5V3H13V9H19V21Z" fill="currentColor"/>
                </svg>
              </div>
            {/if}
          </div>
          <div class="artist-info">
            <h4 class="artist-name">{artist.name}</h4>
            <p class="artist-genres">{artist.genres.slice(0, 2).join(" • ")}</p>
            <div class="artist-stats">
              <span class="popularity">{artist.popularity}/100</span>
            </div>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .related-artists-container {
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
  }

  .section-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 20px;
    text-align: center;
  }

  .main-connection {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
  }

  .connection-line {
    width: 2px;
    height: 40px;
    background: var(--gradient-primary);
    border-radius: 1px;
    opacity: 0.8;
  }

  .connection-dot {
    position: absolute;
    top: -8px;
    width: 16px;
    height: 16px;
    background: var(--accent-color);
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(var(--accent-rgb), 0.3);
  }

  .artists-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .artist-item {
    position: relative;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .artist-item:hover {
    transform: translateX(8px);
  }

  .item-connection {
    position: absolute;
    left: -20px;
    top: 50%;
    width: 16px;
    height: 2px;
    background: var(--accent-color);
    opacity: 0.6;
    transform: translateY(-50%);
  }

  .artist-card {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 16px;
    box-shadow: var(--shadow-sm);
    transition: all 0.3s ease;
    width: 100%;
  }

  .artist-card:hover {
    box-shadow: var(--shadow-md);
    border-color: var(--accent-color);
    background: var(--bg-hover);
  }

  .artist-image {
    width: 70px;
    height: 70px;
    border-radius: 8px;
    overflow: hidden;
    background: var(--bg-tertiary);
    flex-shrink: 0;
  }

  .artist-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .placeholder-image {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-secondary);
    background: var(--bg-tertiary);
  }

  .artist-info {
    flex: 1;
    min-width: 0;
  }

  .artist-name {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 6px 0;
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .artist-genres {
    font-size: 0.85rem;
    color: var(--text-secondary);
    margin: 0 0 8px 0;
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .artist-stats {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .popularity {
    font-size: 0.8rem;
    color: var(--accent-color);
    font-weight: 500;
  }

  /* Responsividade */
  @media (max-width: 768px) {
    .related-artists-container {
      max-width: 100%;
      padding: 16px;
    }

    .section-title {
      font-size: 1rem;
      margin-bottom: 16px;
    }

    .artists-list {
      gap: 12px;
    }

    .artist-card {
      padding: 12px;
      gap: 12px;
    }

    .artist-image {
      width: 60px;
      height: 60px;
    }

    .artist-name {
      font-size: 0.9rem;
    }

    .artist-genres {
      font-size: 0.8rem;
    }

    .popularity {
      font-size: 0.75rem;
    }

    .connection-line {
      height: 35px;
    }

    .connection-dot {
      width: 14px;
      height: 14px;
      top: -7px;
    }

    .item-connection {
      left: -16px;
      width: 12px;
    }
  }

  @media (max-width: 480px) {
    .related-artists-container {
      padding: 12px;
    }

    .artists-list {
      gap: 10px;
    }

    .artist-card {
      padding: 10px;
      gap: 10px;
    }

    .artist-image {
      width: 50px;
      height: 50px;
    }

    .artist-name {
      font-size: 0.85rem;
    }

    .artist-genres {
      font-size: 0.75rem;
    }

    .popularity {
      font-size: 0.7rem;
    }

    .item-connection {
      left: -12px;
      width: 10px;
    }
  }
</style>

