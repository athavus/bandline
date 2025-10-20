<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { SpotifyAlbumTracks } from "../../types/tracks.ts";
  import TrackCard from "./TrackCard.svelte";
  import LoadingSpinner from "../utils/LoadingSpinner.svelte";
  import SpotifyButton from "../utils/SpotifyButton.svelte";
  import { t } from "../../lib/stores/language";

  export let album: any;
  export let albumTracks: SpotifyAlbumTracks | null = null;
  export let loading: boolean = false;

  const dispatch = createEventDispatcher();

  function handleClose() {
    dispatch("close");
  }

  function openAlbumInSpotify(e: Event) {
    e.stopPropagation();
    window.open(`https://open.spotify.com/album/${album.id}`, "_blank");
  }
</script>

<div class="tracks-panel">
  {#if loading}
    <LoadingSpinner text={t("loadingTracks")} small={true} />
  {:else if albumTracks?.items}
    <div class="tracks-header">
      <h3>{album.name}</h3>
      <button class="close-btn" on:click={handleClose}>✕</button>
    </div>

    <div class="tracks-content">
      <div class="album-cover-section">
        <div class="album-cover-wrapper">
          {#if album.images?.length}
            <img
              src={album.images[0].url}
              alt={album.name}
              class="album-cover-large"
            />
          {:else}
            <div class="no-image-large">♫</div>
          {/if}
          <div class="spotify-button-wrapper">
            <SpotifyButton large on:click={openAlbumInSpotify} />
          </div>
        </div>
        <div class="album-info">
          <h4>{album.name}</h4>
          <p class="release-date">{album.release_date}</p>
          <p class="track-count">
            {albumTracks.items.length}
            {albumTracks.items.length === 1 ? t("track") : t("tracks")}
          </p>
        </div>
      </div>

      <div class="tracks-grid">
        {#each albumTracks.items as track}
          <TrackCard {track} />
        {/each}
      </div>
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

  .tracks-content {
    display: flex;
    gap: 40px;
    align-items: flex-start;
  }

  .album-cover-section {
    flex-shrink: 0;
    width: 300px;
    position: sticky;
    top: 20px;
  }

  .album-cover-wrapper {
    position: relative;
    width: 100%;
    margin-bottom: 20px;
    overflow: visible;
  }

  .spotify-button-wrapper {
    position: absolute;
    bottom: 20px;
    right: 12px;
    z-index: 10;
  }

  .album-cover-large {
    width: 100%;
    height: 300px;
    object-fit: cover;
    border-radius: 16px;
    box-shadow: var(--shadow-xl);
    border: 3px solid var(--border-color);
    display: block;
    position: relative;
    z-index: 1;
  }

  .no-image-large {
    width: 100%;
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-secondary);
    border-radius: 16px;
    font-size: 4rem;
    color: var(--text-tertiary);
    font-weight: 900;
    border: 3px solid var(--border-color);
    position: relative;
    z-index: 1;
  }

  .album-info {
    text-align: left;
  }

  .album-info h4 {
    font-family: var(--font-heading);
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 12px;
    line-height: 1.3;
  }

  .album-info .release-date {
    font-family: var(--font-primary);
    font-size: 1rem;
    color: var(--text-secondary);
    margin: 0 0 8px;
  }

  .album-info .track-count {
    font-family: var(--font-primary);
    font-size: 0.9rem;
    color: var(--text-tertiary);
    margin: 0;
    font-weight: 600;
  }

  .tracks-grid {
    flex: 1;
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

    .tracks-content {
      gap: 30px;
    }

    .album-cover-section {
      width: 250px;
    }

    .album-cover-large,
    .no-image-large {
      height: 250px;
    }
  }

  @media (max-width: 768px) {
    .tracks-panel {
      margin: 30px 16px 0;
      padding: 24px;
      border-radius: 8px;
    }

    .tracks-content {
      flex-direction: column;
      gap: 24px;
    }

    .album-cover-section {
      width: 100%;
      position: static;
      display: flex;
      gap: 20px;
      align-items: center;
    }

    .album-cover-large,
    .no-image-large {
      width: 150px;
      height: 150px;
      margin-bottom: 0;
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

    .album-cover-section {
      flex-direction: column;
      align-items: flex-start;
    }

    .album-cover-large,
    .no-image-large {
      width: 100%;
      height: 200px;
    }

    .album-info h4 {
      font-size: 1.2rem;
    }
  }
</style>
