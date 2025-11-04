<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import SpotifyButton from "../utils/SpotifyButton.svelte";
  import { t } from "../../../lib/stores/language";
  import Icon from "@iconify/svelte";
  import "./AlbumCoverEffect.css";
  import "./AlbumCard.css";

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
