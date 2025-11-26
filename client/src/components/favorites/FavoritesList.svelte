<script lang="ts">
    import AlbumListItem from "./AlbumListItem.svelte";
    import { createEventDispatcher } from "svelte";

    interface FavoriteAlbum {
        id: number;
        albumId: string;
        albumName: string;
        albumImage?: string;
        albumTracks: string;
        albumReleaseDate?: string;
        favoritedAt: string;
    }

    export let favorites: FavoriteAlbum[] = [];

    const dispatch = createEventDispatcher();

    function handleOpenSpotify(event: CustomEvent<string>) {
        dispatch("openSpotify", event.detail);
    }

    function handleRemove(event: CustomEvent<string>) {
        dispatch("remove", event.detail);
    }
</script>

<div class="favorites-list">
    {#if favorites && favorites.length > 0}
        {#each favorites as fav (fav.id)}
            <AlbumListItem
                albumId={fav.albumId}
                albumName={fav.albumName}
                albumImage={fav.albumImage}
                albumTracks={fav.albumTracks}
                favoritedAt={fav.favoritedAt}
                on:openSpotify={handleOpenSpotify}
                on:remove={handleRemove}
            />
        {/each}
    {:else}
        <p style="color: var(--text-secondary); padding: 20px;">
            Nenhum item para exibir (Debug)
        </p>
    {/if}
</div>

<style>
    .favorites-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
        animation: fadeIn 0.5s ease-in;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>
