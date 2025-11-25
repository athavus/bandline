<script lang="ts">
    import Icon from "@iconify/svelte";
    import { createEventDispatcher } from "svelte";

    import "./AlbumCard.css";

    export let favoritesAlbumId: string;
    export let favoritesAlbumName: string;
    export let favoritesAlbumImage: string | undefined;
    export let favoritesAlbumTracks: string;
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
        dispatch("openSpotify", favoritesAlbumId);
    }

    function handleRemove() {
        dispatch("remove", favoritesAlbumId);
    }
</script>

<div class="favorites-album-card">
    <div class="favorites-album-cover">
        {#if favoritesAlbumImage}
            <img
                src={favoritesAlbumImage}
                alt={favoritesAlbumName}
                loading="lazy"
            />
        {:else}
            <div class="no-image">
                <Icon icon="mdi:music-note" width="48" height="48" />
            </div>
        {/if}
        <div class="favorites-album-overlay">
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
    <div class="favorites-album-info">
        <h3 class="favorites-album-name">{favoritesAlbumName}</h3>
        <div class="favorites-album-meta">
            <span class="track-count">
                <Icon icon="mdi:music" width="14" height="14" />
                {favoritesAlbumTracks} faixas
            </span>
            <span class="favorite-date">
                <Icon icon="mdi:calendar" width="14" height="14" />
                {formatDate(favoritedAt)}
            </span>
        </div>
    </div>
</div>
