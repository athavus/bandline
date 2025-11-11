<script lang="ts">
  // removed unused dispatcher
  import type { SpotifyAlbums } from "../../../types/album.ts";
  import type { SpotifyAlbumTracks } from "../../../types/tracks.ts";
  import AlbumCard from "./AlbumCard.svelte";
  import TracksPanel from "./TracksPanel.svelte";
  import LoadingSpinner from "../../utils/LoadingSpinner.svelte";
  import NavigationButton from "../../utils/NavigationButton.svelte";
  import BrandSubtitle from "../../titles/BrandSubtitle.svelte";
  import { t } from "../../../lib/stores/language";
  import "./AlbumTimeline.css";

  export let artistId: string = "";

  let albums: SpotifyAlbums | null = null;
  let selectedAlbum: any = null;
  let albumTracks: SpotifyAlbumTracks | null = null;
  let loading = false;
  let tracksLoading = false;
  let error: string | null = null;
  let sliderElement: HTMLElement;

  // no dispatch usage
  const API_URL = import.meta.env.VITE_API_URL;
  function scroll(amount: number) {
    sliderElement?.scrollBy({ left: amount, behavior: "smooth" });
  }

  async function loadAlbums() {
    if (!artistId) return;
    loading = true;
    error = null;
    albums = null;
    selectedAlbum = null; // Reset selected album
    try {
      const res = await fetch(`${API_URL}/artistAlbums/${artistId}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      albums = await res.json();
    } catch (err) {
      error = err instanceof Error ? err.message : "Erro desconhecido";
    } finally {
      loading = false;
    }
  }

  async function loadAlbumTracks(albumId: string) {
    tracksLoading = true;
    try {
      const res = await fetch(`${API_URL}/albumTracks/${albumId}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      albumTracks = await res.json();
    } catch {
      albumTracks = null;
    } finally {
      tracksLoading = false;
    }
  }

  function handleAlbumClick(album: any) {
    if (selectedAlbum?.id === album.id) {
      selectedAlbum = null;
      albumTracks = null;
    } else {
      selectedAlbum = album;
      loadAlbumTracks(album.id);
    }
  }

  function getTimelineX(i: number) {
    return 200 + i * 350;
  }

  function getTotalWidth() {
    return albums?.items ? getTimelineX(albums.items.length - 1) + 200 : 0;
  }

  $: if (albums?.items && albums.items.length > 0 && !selectedAlbum) {
    selectedAlbum = albums.items[0];
    loadAlbumTracks(selectedAlbum.id);
  }

  $: artistId && loadAlbums();
</script>

{#if loading}
  <div class="disco-loading">
    <LoadingSpinner text={t("loadingDiscography")} />
  </div>
{:else if error}
  <div class="error">
    <p>{t("errorLoadingDiscography")} {error}</p>
    <button on:click={loadAlbums}>{t("tryAgain")}</button>
  </div>
{:else if albums?.items?.length}
  <div class="timeline-container">
    <BrandSubtitle firstWord={t("firstWord")} secondWord={t("lastWord")} />
    <div class="timeline-wrapper">
      <NavigationButton
        direction="prev"
        on:click={() => scroll(-400)}
        aria-label={t("previous")}
      />

      <div class="timeline-slider" bind:this={sliderElement}>
        <div class="timeline-track" style="width: {getTotalWidth()}px">
          <div class="timeline-dots">
            {#each albums.items as _album, i}
              <span
                class="timeline-dot {selectedAlbum?.id === _album.id
                  ? 'active'
                  : ''}"
                style="left: {getTimelineX(i)}px"
              ></span>
            {/each}
          </div>
          {#each albums.items as album, i (album.id)}
            <AlbumCard
              {album}
              position={getTimelineX(i) - 90}
              active={selectedAlbum?.id === album.id}
              on:click={() => handleAlbumClick(album)}
            />
          {/each}
        </div>
      </div>

      <NavigationButton
        direction="next"
        on:click={() => scroll(400)}
        aria-label={t("next")}
      />
    </div>

    {#if selectedAlbum}
      <TracksPanel
        album={selectedAlbum}
        {albumTracks}
        loading={tracksLoading}
        on:close={() => handleAlbumClick(selectedAlbum)}
      />
    {/if}
  </div>
{:else}
  <div class="no-albums">
    <p>{t("noAlbumsFound")}</p>
  </div>
{/if}
