<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import SpotifyButton from "./SpotifyButton.svelte";

  export let album: any;
  export let position: number;
  export let active: boolean = false;

  const dispatch = createEventDispatcher();

  function formatDate(dateString: string) {
    const date = new Date(
      dateString.length === 4
        ? `${dateString}-01-01`
        : dateString.length === 7
          ? `${dateString}-01`
          : dateString,
    );
    return date.toLocaleDateString("pt-BR", {
      year: "numeric",
      month: dateString.length === 4 ? undefined : "long",
      day: dateString.length > 7 ? "numeric" : undefined,
    });
  }

  function handleClick() {
    dispatch("click");
  }

  function openAlbumInSpotify(e: Event) {
    e.stopPropagation();
    window.open(`https://open.spotify.com/album/${album.id}`, "_blank");
  }
</script>

<div
  class="album-item {active ? 'active' : ''}"
  style="left: {position}px"
  on:click={handleClick}
  on:keypress={(e) => e.key === "Enter" && handleClick()}
  role="button"
  tabindex="0"
>
  <div class="album-cover">
    {#if album.images?.length}
      <img src={album.images[0].url} alt={album.name} loading="lazy" />
    {:else}
      <div class="no-image">♫</div>
    {/if}

    <SpotifyButton on:click={openAlbumInSpotify} />
  </div>

  <div class="album-details">
    <h3 class="album-name">{album.name}</h3>
    <p class="album-year">{formatDate(album.release_date)}</p>
    {#if album.total_tracks > 1}
      <span class="album-badge">{album.total_tracks} faixas</span>
    {:else if album.total_tracks == 1}
      <span class="album-badge">{album.total_tracks} faixa</span>
    {/if}
  </div>
</div>

<style>
  .album-item {
    position: absolute;
    top: 0;
    width: 180px;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 3;
  }

  .album-item:hover,
  .album-item.active {
    transform: translateY(-15px) scale(1.05);
  }

  /* Timeline connector */
  .album-item::before {
    content: '';
    position: absolute;
    top: 85px;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: 20px;
    background: var(--accent-color);
    border-radius: 1px;
    z-index: 1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .album-item:hover::before,
  .album-item.active::before {
    opacity: 1;
  }

  .album-cover {
    width: 170px;
    height: 170px;
    border-radius: 20px;
    background: var(--bg-secondary);
    border: 3px solid var(--border-color);
    margin-bottom: 20px;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    box-shadow: var(--shadow-md);
  }

  .album-item:hover .album-cover {
    border-color: var(--accent-color);
    box-shadow: var(--shadow-xl);
    transform: rotate(2deg);
  }

  .album-item:hover .album-cover img {
    transform: scale(1.1);
  }

  .album-cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }

  .no-image {
    font-size: 3rem;
    color: var(--text-tertiary);
    font-weight: 900;
    transition: color 0.3s ease;
  }

  .album-details {
    text-align: center;
    width: 150px;
  }

  .album-name {
    font-family: var(--font-heading);
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color 0.3s ease;
    text-align: center;
  }

  .album-year {
    font-family: var(--font-primary);
    font-size: 0.9rem;
    color: var(--text-secondary);
    margin: 0 0 10px;
    font-weight: 500;
    transition: color 0.3s ease;
    text-align: center;
  }

  .album-badge {
    font-family: var(--font-primary);
    font-size: 0.7rem;
    font-weight: 600;
    background: var(--accent-color);
    color: white;
    border: none;
    border-radius: 12px;
    padding: 4px 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    display: inline-block;
    transition: all 0.3s ease;
    box-shadow: var(--shadow-sm);
  }

  .album-item:hover .album-badge {
    background: var(--accent-hover);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  @media (max-width: 1024px) {
    .album-item {
      width: 150px;
    }
    .album-cover {
      width: 140px;
      height: 140px;
    }
    .album-details {
      width: 130px;
    }
    .album-name {
      font-size: 1rem;
    }
    .album-year {
      font-size: 0.85rem;
    }
  }

  @media (max-width: 768px) {
    .album-item {
      width: 120px;
    }
    .album-cover {
      width: 110px;
      height: 110px;
      border-radius: 16px;
    }
    .album-details {
      width: 100px;
    }
    .album-name {
      font-size: 0.9rem;
    }
    .album-year {
      font-size: 0.8rem;
    }
    .album-badge {
      font-size: 0.65rem;
      padding: 3px 10px;
    }
  }

  @media (max-width: 480px) {
    .album-item {
      width: 100px;
    }
    .album-cover {
      width: 90px;
      height: 90px;
      border-radius: 12px;
    }
    .album-details {
      width: 85px;
    }
    .album-name {
      font-size: 0.8rem;
    }
    .album-year {
      font-size: 0.75rem;
    }
    .album-badge {
      font-size: 0.6rem;
      padding: 2px 8px;
    }
  }
</style>
