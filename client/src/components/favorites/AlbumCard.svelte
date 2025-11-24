<script lang="ts">
    import Icon from "@iconify/svelte";
    import { createEventDispatcher } from "svelte";

    import "./AlbumCard.css";

    export let albumId: string;
    export let albumName: string;
    export let albumImage: string | undefined;
    export let albumTracks: string;
    export let favoritedAt: string;

    const dispatch = createEventDispatcher();

    function formatDate(dateString: string) {
        const date = new Date(dateString);
        return date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    }

    function handleOpenSpotify() {
        dispatch("openSpotify", albumId);
    }

    function handleRemove() {
        dispatch("remove", albumId);
    }
</script>

<div class="album-card">
    <div class="album-cover">
        {#if albumImage}
            <img src={albumImage} alt={albumName} loading="lazy" />
        {:else}
            <div class="no-image">
                <Icon icon="mdi:music-note" width="48" height="48" />
            </div>
        {/if}
        <div class="album-overlay">
            <button
                class="action-btn spotify-btn"
                on:click={handleOpenSpotify}
                title="Abrir no Spotify"
            >
                <Icon icon="mdi:spotify" width="24" height="24" />
            </button>
            <button
                class="action-btn remove-btn"
                on:click={handleRemove}
                title="Remover dos favoritos"
            >
                <Icon icon="mdi:heart-off" width="24" height="24" />
            </button>
        </div>
    </div>
    <div class="album-info">
        <h3 class="album-name">{albumName}</h3>
        <div class="album-meta">
            <span class="track-count">
                <Icon icon="mdi:music" width="14" height="14" />
                {albumTracks} faixas
            </span>
            <span class="favorite-date">
                <Icon icon="mdi:calendar" width="14" height="14" />
                {formatDate(favoritedAt)}
            </span>
        </div>
    </div>
</div>
