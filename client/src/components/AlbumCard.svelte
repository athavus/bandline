<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import SpotifyButton from "./SpotifyButton.svelte";
  import { t } from "../lib/stores/language";

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

    <SpotifyButton on:click={openAlbumInSpotify} />
  </div>

  <div class="album-details">
    <h3 class="album-name">{album.name}</h3>
    <p class="album-year">{formatDate(album.release_date)}</p>
    {#if album.total_tracks > 1}
      <span class="album-badge">{album.total_tracks} {t('tracks')}</span>
    {:else if album.total_tracks === 1}
      <span class="album-badge">{album.total_tracks} {t('track')}</span>
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

  /* Audio spectrogram effect on active album - left side */
  .album-item.active .album-cover::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: -170px !important;
    top: 0px;
    width: 220px !important;
    height: 250px !important;
    pointer-events: none;
    z-index: -1;
    background:
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 20%, transparent 60%) 4% 100% / 3px 20%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 30%, transparent 30%) 6% 100% / 3px 30%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 50%, transparent 50%) 8% 100% / 3px 50%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 40%, transparent 70%) 10% 100% / 3px 40%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 35%, transparent 35%) 12% 100% / 3px 35%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 55%, transparent 55%) 14% 100% / 3px 55%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 50%, transparent 80%) 16% 100% / 3px 40%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 25%, transparent 25%) 18% 100% / 3px 25%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 45%, transparent 45%) 20% 100% / 3px 45%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 50%, transparent 65%) 22% 100% / 3px 65%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 40%, transparent 40%) 24% 100% / 3px 40%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 55%, transparent 60%) 26% 100% / 3px 50%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 30%, transparent 30%) 28% 100% / 3px 30%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 50%, transparent 50%) 30% 100% / 3px 50%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 40%, transparent 70%) 32% 100% / 3px 20%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 35%, transparent 35%) 34% 100% / 3px 35%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 55%, transparent 55%) 36% 100% / 3px 55%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 30%, transparent 80%) 38% 100% / 3px 30%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 25%, transparent 25%) 40% 100% / 3px 25%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 45%, transparent 45%) 42% 100% / 3px 45%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 35%, transparent 65%) 44% 100% / 3px 15%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 40%, transparent 40%) 46% 100% / 3px 40%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 10%, transparent 60%) 48% 100% / 3px 20%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 30%, transparent 30%) 50% 100% / 3px 30%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 50%, transparent 50%) 52% 100% / 3px 50%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 40%, transparent 70%) 54% 100% / 3px 40%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 35%, transparent 35%) 56% 100% / 3px 35%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 55%, transparent 55%) 58% 100% / 3px 55%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 20%, transparent 80%) 60% 100% / 3px 30%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 25%, transparent 25%) 62% 100% / 3px 25%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 45%, transparent 45%) 64% 100% / 3px 45%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 35%, transparent 65%) 66% 100% / 3px 55%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 40%, transparent 40%) 68% 100% / 3px 40%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 50%, transparent 60%) 70% 100% / 3px 50%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 30%, transparent 30%) 72% 100% / 3px 30%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 50%, transparent 50%) 74% 100% / 3px 50%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 20%, transparent 70%) 76% 100% / 3px 40%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 35%, transparent 35%) 78% 100% / 3px 35%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 55%, transparent 55%) 80% 100% / 3px 55%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 30%, transparent 80%) 82% 100% / 3px 30%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 25%, transparent 25%) 84% 100% / 3px 25%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 45%, transparent 45%) 86% 100% / 3px 45%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 55%, transparent 65%) 88% 100% / 3px 15%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 40%, transparent 40%) 90% 100% / 3px 40%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 20%, transparent 60%) 92% 100% / 3px 50%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 30%, transparent 30%) 94% 100% / 3px 30%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 50%, transparent 50%) 96% 100% / 3px 50%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 55%, transparent 75%) 98% 100% / 3px 25%;
    background-repeat: no-repeat;
    animation: spectrogram-left 1.25s ease-in-out infinite;
    filter: blur(0.3px);
    transform: rotate(-90deg);
  }

  /* Right side spectrogram */
  .album-item.active .album-cover::after {
    content: "";
    position: absolute;
    bottom: 0;
    right: -170px !important;
    top: -10px;
    width: 220px !important;
    height: 250px !important;
    pointer-events: none;
    z-index: -1;
    background: 
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 20%, transparent 60%) 4% 100% / 3px 20%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 30%, transparent 30%) 6% 100% / 3px 30%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 50%, transparent 50%) 8% 100% / 3px 50%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 40%, transparent 70%) 10% 100% / 3px 40%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 35%, transparent 35%) 12% 100% / 3px 35%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 55%, transparent 55%) 14% 100% / 3px 55%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 50%, transparent 80%) 16% 100% / 3px 40%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 25%, transparent 25%) 18% 100% / 3px 25%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 45%, transparent 45%) 20% 100% / 3px 45%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 50%, transparent 65%) 22% 100% / 3px 65%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 40%, transparent 40%) 24% 100% / 3px 40%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 55%, transparent 60%) 26% 100% / 3px 50%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 30%, transparent 30%) 28% 100% / 3px 30%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 50%, transparent 50%) 30% 100% / 3px 50%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 40%, transparent 70%) 32% 100% / 3px 20%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 35%, transparent 35%) 34% 100% / 3px 35%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 55%, transparent 55%) 36% 100% / 3px 55%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 30%, transparent 80%) 38% 100% / 3px 30%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 25%, transparent 25%) 40% 100% / 3px 25%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 45%, transparent 45%) 42% 100% / 3px 45%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 35%, transparent 65%) 44% 100% / 3px 15%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 40%, transparent 40%) 46% 100% / 3px 40%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 10%, transparent 60%) 48% 100% / 3px 20%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 30%, transparent 30%) 50% 100% / 3px 30%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 50%, transparent 50%) 52% 100% / 3px 50%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 40%, transparent 70%) 54% 100% / 3px 40%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 35%, transparent 35%) 56% 100% / 3px 35%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 55%, transparent 55%) 58% 100% / 3px 55%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 20%, transparent 80%) 60% 100% / 3px 30%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 25%, transparent 25%) 62% 100% / 3px 25%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 45%, transparent 45%) 64% 100% / 3px 45%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 35%, transparent 65%) 66% 100% / 3px 55%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 40%, transparent 40%) 68% 100% / 3px 40%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 50%, transparent 60%) 70% 100% / 3px 50%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 30%, transparent 30%) 72% 100% / 3px 30%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 50%, transparent 50%) 74% 100% / 3px 50%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 20%, transparent 70%) 76% 100% / 3px 40%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 35%, transparent 35%) 78% 100% / 3px 35%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 55%, transparent 55%) 80% 100% / 3px 55%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 30%, transparent 80%) 82% 100% / 3px 30%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 25%, transparent 25%) 84% 100% / 3px 25%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 45%, transparent 45%) 86% 100% / 3px 45%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 55%, transparent 65%) 88% 100% / 3px 15%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 40%, transparent 40%) 90% 100% / 3px 40%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 20%, transparent 60%) 92% 100% / 3px 50%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 30%, transparent 30%) 94% 100% / 3px 30%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 50%, transparent 50%) 96% 100% / 3px 50%,
      linear-gradient(to top, rgba(var(--accent-rgb), 0.9) 0%, rgba(var(--accent-rgb), 0.9) 55%, transparent 75%) 98% 100% / 3px 25%;
    background-repeat: no-repeat;
    animation: spectrogram-right 1.25s ease-in-out infinite;
    filter: blur(0.3px);
    transform: rotate(90deg);
  }

  @keyframes spectrogram-left {
    0% { 
      background-size: 3px 30%, 3px 50%, 3px 40%, 3px 70%, 3px 35%, 3px 60%, 3px 45%, 3px 80%, 3px 25%, 3px 55%;
    }
    10% { 
      background-size: 3px 50%, 3px 35%, 3px 70%, 3px 45%, 3px 60%, 3px 30%, 3px 75%, 3px 40%, 3px 55%, 3px 65%;
    }
    20% { 
      background-size: 3px 40%, 3px 65%, 3px 50%, 3px 30%, 3px 70%, 3px 45%, 3px 60%, 3px 35%, 3px 75%, 3px 50%;
    }
    30% { 
      background-size: 3px 70%, 3px 45%, 3px 35%, 3px 80%, 3px 50%, 3px 65%, 3px 40%, 3px 55%, 3px 30%, 3px 60%;
    }
    40% { 
      background-size: 3px 35%, 3px 75%, 3px 60%, 3px 40%, 3px 55%, 3px 50%, 3px 70%, 3px 45%, 3px 65%, 3px 35%;
    }
    50% { 
      background-size: 3px 60%, 3px 40%, 3px 70%, 3px 55%, 3px 45%, 3px 75%, 3px 35%, 3px 65%, 3px 50%, 3px 40%;
    }
    60% { 
      background-size: 3px 45%, 3px 70%, 3px 35%, 3px 65%, 3px 80%, 3px 40%, 3px 55%, 3px 50%, 3px 60%, 3px 75%;
    }
    70% { 
      background-size: 3px 75%, 3px 50%, 3px 65%, 3px 35%, 3px 60%, 3px 70%, 3px 45%, 3px 30%, 3px 80%, 3px 55%;
    }
    80% { 
      background-size: 3px 50%, 3px 60%, 3px 45%, 3px 75%, 3px 40%, 3px 55%, 3px 65%, 3px 70%, 3px 35%, 3px 50%;
    }
    90% { 
      background-size: 3px 65%, 3px 35%, 3px 80%, 3px 50%, 3px 70%, 3px 45%, 3px 30%, 3px 60%, 3px 55%, 3px 40%;
    }
    100% { 
      background-size: 3px 30%, 3px 50%, 3px 40%, 3px 70%, 3px 35%, 3px 60%, 3px 45%, 3px 80%, 3px 25%, 3px 55%;
    }
  }

  @keyframes spectrogram-right {
    0% { 
      background-size: 3px 45%, 3px 65%, 3px 30%, 3px 75%, 3px 40%, 3px 55%, 3px 35%, 3px 70%, 3px 50%, 3px 60%;
    }
    10% { 
      background-size: 3px 65%, 3px 40%, 3px 70%, 3px 50%, 3px 60%, 3px 45%, 3px 75%, 3px 35%, 3px 55%, 3px 50%;
    }
    20% { 
      background-size: 3px 35%, 3px 75%, 3px 50%, 3px 40%, 3px 65%, 3px 60%, 3px 45%, 3px 55%, 3px 70%, 3px 35%;
    }
    30% { 
      background-size: 3px 80%, 3px 50%, 3px 65%, 3px 45%, 3px 55%, 3px 70%, 3px 40%, 3px 60%, 3px 35%, 3px 75%;
    }
    40% { 
      background-size: 3px 50%, 3px 70%, 3px 40%, 3px 65%, 3px 50%, 3px 35%, 3px 75%, 3px 45%, 3px 60%, 3px 55%;
    }
    50% { 
      background-size: 3px 70%, 3px 35%, 3px 75%, 3px 55%, 3px 45%, 3px 65%, 3px 50%, 3px 70%, 3px 40%, 3px 60%;
    }
    60% { 
      background-size: 3px 40%, 3px 60%, 3px 55%, 3px 70%, 3px 75%, 3px 50%, 3px 65%, 3px 35%, 3px 80%, 3px 45%;
    }
    70% { 
      background-size: 3px 65%, 3px 45%, 3px 60%, 3px 35%, 3px 70%, 3px 75%, 3px 50%, 3px 80%, 3px 55%, 3px 40%;
    }
    80% { 
      background-size: 3px 55%, 3px 75%, 3px 45%, 3px 60%, 3px 50%, 3px 40%, 3px 70%, 3px 65%, 3px 35%, 3px 55%;
    }
    90% { 
      background-size: 3px 70%, 3px 50%, 3px 80%, 3px 45%, 3px 65%, 3px 55%, 3px 35%, 3px 75%, 3px 60%, 3px 40%;
    }
    100% { 
      background-size: 3px 45%, 3px 65%, 3px 30%, 3px 75%, 3px 40%, 3px 55%, 3px 35%, 3px 70%, 3px 50%, 3px 60%;
    }
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
