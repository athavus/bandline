<script lang="ts">
    import Icon from "@iconify/svelte";
    import { createEventDispatcher } from "svelte";

    import "./AlbumListItem.css";

    export let albumId: string = "";
    export let albumName: string = "";
    export let albumImage: string | undefined = undefined;
    export let albumTracks: string = "0";
    export let favoritedAt: string = "";

    const dispatch = createEventDispatcher();

    function formatDate(dateString: string) {
        if (!dateString) return "Data desconhecida";
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

    // Debug
    $: console.log("AlbumListItem rendered:", {
        albumId,
        albumName,
        albumTracks,
    });
</script>

<div class="album-list-item">
    <div class="list-item-cover">
        {#if albumImage}
            <img src={albumImage} alt={albumName} loading="lazy" />
        {:else}
            <div class="no-image-list">
                <Icon icon="mdi:music-note" width="24" height="24" />
            </div>
        {/if}
    </div>

    <div class="list-item-info">
        <h3 class="list-album-name">{albumName}</h3>
        <div class="list-album-meta">
            <span>
                <Icon icon="mdi:music" width="14" height="14" />
                {albumTracks} faixas
            </span>
            <span class="separator">•</span>
            <span>
                <Icon icon="mdi:calendar" width="14" height="14" />
                {formatDate(favoritedAt)}
            </span>
        </div>
    </div>

    <div class="list-item-actions">
        <button
            class="list-action-btn"
            on:click={handleOpenSpotify}
            title="Abrir no Spotify"
        >
            <Icon icon="mdi:spotify" width="20" height="20" />
        </button>
        <button
            class="list-action-btn list-remove-btn"
            on:click={handleRemove}
            title="Remover dos favoritos"
        >
            <Icon icon="mdi:heart-off" width="20" height="20" />
        </button>
    </div>
</div>
