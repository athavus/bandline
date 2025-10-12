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
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 3;
  }

  .album-item:hover,
  .album-item.active {
    transform: translateY(-15px);
  }

  .album-cover {
    width: 170px;
    height: 170px;
    border-radius: 20px;
    background: var(--bg-secondary);
    border: 2px solid var(--border-color);
    margin-bottom: 20px;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .album-item:hover .album-cover {
    border-color: var(--text-primary);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }

  .album-item:hover .album-cover img {
    transform: scale(1.05);
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
    font-size: 1.1rem;
    font-weight: 800;
    color: var(--text-primary);
    margin: 0 0 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color 0.3s ease;
  }

  .album-year {
    font-size: 0.95rem;
    color: var(--text-secondary);
    margin: 0 0 10px;
    font-weight: 600;
    transition: color 0.3s ease;
  }

  .album-badge {
    font-size: 0.75rem;
    font-weight: 700;
    background: var(--bg-secondary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    border-radius: 20px;
    padding: 6px 14px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    display: inline-block;
    transition: all 0.3s ease;
  }

  .album-item:hover .album-badge {
    background: var(--text-primary);
    color: var(--bg-primary);
    border-color: var(--text-primary);
  }

  @media (max-width: 1024px) {
    .album-item {
      width: 150px;
    }
    .album-cover {
      width: 140px;
      height: 140px;
    }
  }

  @media (max-width: 768px) {
    .album-item {
      width: 120px;
    }
    .album-cover {
      width: 110px;
      height: 110px;
    }
  }
</style>
