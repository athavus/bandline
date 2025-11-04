<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import SpotifyButton from "../utils/SpotifyButton.svelte";
  import { t } from "../../../lib/stores/language";
  import Icon from "@iconify/svelte";
  import "./AlbumCoverEffect.css";

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
    return date.toLocaleDateString("en-US", {
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
    <div class="album-actions">
      <button class="icon-btn completed" aria-label="Mark as completed">
        <Icon icon="mdi:check-circle" width="24" height="24" />
      </button>
      <button class="icon-btn favorite" aria-label="Mark as favorite">
        <Icon icon="mdi:heart" width="24" height="24" />
      </button>
    </div>
    <SpotifyButton on:click={openAlbumInSpotify} />
  </div>

  <div class="album-details">
    <h3 class="album-name">{album.name}</h3>
    <p class="album-year">{formatDate(album.release_date)}</p>
    {#if album.total_tracks > 1}
      <span class="album-badge">{album.total_tracks} {t("tracks")}</span>
    {:else if album.total_tracks === 1}
      <span class="album-badge">{album.total_tracks} {t("track")}</span>
    {/if}
  </div>
</div>

<style>
  .album-item {
    position: absolute;
    top: 0;
    width: 240px;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 3;
  }

  .album-item:hover,
  .album-item.active {
    transform: translateY(-12px) scale(1.04);
    z-index: 5;
  }

  .album-cover {
    position: relative;
    width: 240px;
    height: 240px;
    border-radius: 20px;
    background: var(--bg-secondary);
    border: 3px solid var(--border-color);
    margin-bottom: 20px;
    overflow: visible;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    justify-content: center;
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
    border-radius: 17px;
  }

  .no-image {
    font-size: 3rem;
    color: var(--text-tertiary);
    font-weight: 900;
    transition: color 0.3s ease;
  }

  .album-actions {
    position: absolute;
    bottom: 60px; /* ajusta para ficar acima do SpotifyButton */
    right: 12px;
    display: flex;
    flex-direction: column; /* alinha os botões na vertical */
    gap: 12px;
    z-index: 10;
  }

  .icon-btn {
    background: rgba(0, 0, 0, 0.5);
    border: none;
    border-radius: 50%;
    padding: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition:
      background-color 0.3s ease,
      box-shadow 0.3s ease,
      transform 0.3s ease;
  }

  .icon-btn svg {
    fill: white;
    transition: fill 0.3s ease;
  }

  .icon-btn:hover {
    background: var(--accent-color);
    box-shadow: 0 0 8px var(--accent-color);
    transform: scale(1.1);
  }

  .icon-btn:hover svg {
    fill: white;
  }

  .icon-btn.completed {
    background: rgba(34, 139, 34, 0.6);
  }

  .icon-btn.completed:hover {
    background: #1db954;
    box-shadow: 0 0 12px #1db954;
  }

  .icon-btn.favorite {
    background: rgba(220, 20, 60, 0.6);
  }

  .icon-btn.favorite:hover {
    background: #e22134;
    box-shadow: 0 0 12px #e22134;
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
  }

  .album-item.active .album-name {
    color: var(--accent-color);
  }

  .album-year {
    font-family: var(--font-primary);
    font-size: 0.9rem;
    color: var(--text-secondary);
    margin: 0 0 10px;
    font-weight: 500;
    transition: color 0.3s ease;
  }

  .album-item.active .album-year {
    color: var(--text-secondary);
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
      border-radius: 16px;
    }
    .album-cover img {
      border-radius: 13px;
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
    .album-item.active .album-cover::before {
      left: -15px;
      width: 35px;
      height: 80px;
    }
    .album-item.active .album-cover::after {
      right: -15px;
      width: 35px;
      height: 80px;
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
    .album-cover img {
      border-radius: 13px;
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
    .album-item.active .album-cover::before {
      left: -12px;
      width: 30px;
      height: 70px;
    }
    .album-item.active .album-cover::after {
      right: -12px;
      width: 30px;
      height: 70px;
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
    .album-cover img {
      border-radius: 9px;
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
    .album-item.active .album-cover::before {
      left: -5px;
      width: 4px;
    }
    .album-item.active .album-cover::after {
      right: -5px;
      width: 4px;
    }
  }
</style>
