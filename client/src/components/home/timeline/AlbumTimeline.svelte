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
    let favoriteAlbumIds: string[] = [];

    const API_URL = import.meta.env.VITE_API_URL;

    function scroll(amount: number) {
        sliderElement?.scrollBy({ left: amount, behavior: "smooth" });
    }

    async function checkFavorites(albumIds: string[]) {
        try {
            const response = await fetch(`${API_URL}/favorites/check`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ albumIds }),
            });

            if (!response.ok) {
                console.error("Erro ao verificar favoritos");
                return [];
            }

            const data = await response.json();
            return data.favoriteIds || [];
        } catch (err) {
            console.error("Erro ao verificar favoritos:", err);
            return [];
        }
    }

    async function loadAlbums() {
        if (!artistId) return;
        loading = true;
        error = null;
        albums = null;
        selectedAlbum = null;
        favoriteAlbumIds = [];

        try {
            const res = await fetch(`${API_URL}/artistAlbums/${artistId}`);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            albums = await res.json();

            // Verificar quais álbuns estão favoritados
            if (albums?.items?.length) {
                const albumIds = albums.items.map((a) => a.id);
                favoriteAlbumIds = await checkFavorites(albumIds);
                console.log("Álbuns favoritados:", favoriteAlbumIds);
            }
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

    function handleFavoriteToggled(event: CustomEvent) {
        const { albumId, isFavorite } = event.detail;

        if (isFavorite) {
            // Adiciona aos favoritos
            if (!favoriteAlbumIds.includes(albumId)) {
                favoriteAlbumIds = [...favoriteAlbumIds, albumId];
            }
        } else {
            // Remove dos favoritos
            favoriteAlbumIds = favoriteAlbumIds.filter((id) => id !== albumId);
        }

        console.log("Favoritos atualizados:", favoriteAlbumIds);
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
                                class="timeline-dot {selectedAlbum?.id ===
                                _album.id
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
                            isFavorite={favoriteAlbumIds.includes(album.id)}
                            on:click={() => handleAlbumClick(album)}
                            on:favoriteToggled={handleFavoriteToggled}
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
