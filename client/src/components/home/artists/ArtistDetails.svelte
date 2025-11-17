<script lang="ts">
    import type { SpotifyArtist } from "../../../types/artist.ts";
    import SpotifyButton from "../../utils/SpotifyButton.svelte";
    import RelatedArtists from "./RelatedArtists.svelte";
    import { createEventDispatcher } from "svelte";
    import { t } from "../../../lib/stores/language";
    import "./ArtistDetails.css";

    export let artist: SpotifyArtist;

    const dispatch = createEventDispatcher();

    function openArtistInSpotify(e: Event) {
        e.stopPropagation();
        if (artist.id) {
            window.open(
                `https://open.spotify.com/artist/${artist.id}`,
                "_blank",
            );
        }
    }

    function handleRelatedArtistSelect(event: CustomEvent) {
        dispatch("selectRelatedArtist", event.detail);
    }
</script>

<div class="artist-layout">
    <!-- Card principal do artista -->
    <div class="artist-card">
        <div class="artist-header">
            <!-- Descrição esticada -->
            <div class="description-section">
                <h3 class="section-title">{t("about")}</h3>
                <div class="description-content">
                    <p>{artist.description}</p>
                </div>
            </div>

            <!-- Informações do artista compactas -->
            <div class="artist-info-section">
                <div class="artist-info">
                    <h2>{artist.name}</h2>
                    {#if artist.genres.length > 0}
                        <p class="genres">{artist.genres.join(" • ")}</p>
                    {/if}
                </div>

                <div class="artist-content">
                    <!-- Estatísticas à esquerda da imagem -->
                    <div class="info-stats">
                        <div class="info-item">
                            <span class="label">{t("followers")}</span>
                            <span class="value">
                                {artist.total_followers?.toLocaleString(
                                    "en-US",
                                ) ?? "—"}
                            </span>
                        </div>
                        <div class="info-item">
                            <span class="label">{t("popularity")}</span>
                            <span class="value popularity">
                                <span
                                    class="bar"
                                    style="--progress: {artist.popularity}%"
                                ></span>
                                {artist.popularity}/100
                            </span>
                        </div>
                    </div>

                    <!-- Imagem à direita -->
                    <div class="artist-image-wrapper">
                        {#if artist.image}
                            <img
                                src={artist.image}
                                alt={artist.name}
                                class="artist-image"
                            />
                        {:else if artist.images && artist.images.length > 0}
                            <img
                                src={artist.images[0].url}
                                alt={artist.name}
                                class="artist-image"
                            />
                        {/if}
                        <SpotifyButton on:click={openArtistInSpotify} />
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Artistas relacionados -->
    <RelatedArtists {artist} on:selectArtist={handleRelatedArtistSelect} />
</div>
