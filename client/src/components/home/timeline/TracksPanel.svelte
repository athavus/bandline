<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { SpotifyAlbumTracks } from "../../../types/tracks.ts";
    import Icon from "@iconify/svelte";
    import TrackCard from "./TrackCard.svelte";
    import LoadingSpinner from "../../utils/LoadingSpinner.svelte";
    import SpotifyButton from "../../utils/SpotifyButton.svelte";
    import { t } from "../../../lib/stores/language";
    import "./TracksPanel.css";

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
                    <div class="timeline-album-actions">
                        <button
                            class="timeline-icon-btn completed"
                            aria-label="Mark as completed"
                        >
                            <Icon
                                icon="mdi:check-circle"
                                width="24"
                                height="24"
                            />
                        </button>
                        <button
                            class="timeline-icon-btn favorite"
                            aria-label="Mark as favorite"
                        >
                            <Icon icon="mdi:heart" width="24" height="24" />
                        </button>
                    </div>

                    <div class="spotify-button-wrapper">
                        <SpotifyButton large on:click={openAlbumInSpotify} />
                    </div>
                </div>
                <div class="album-info">
                    <h4>{album.name}</h4>
                    <p class="release-date">{album.release_date}</p>
                    <p class="track-count">
                        {albumTracks.items.length}
                        {albumTracks.items.length === 1
                            ? t("track")
                            : t("tracks")}
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
