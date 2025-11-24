<script lang="ts">
    import AlbumCard from "./AlbumCard.svelte";
    import { createEventDispatcher } from "svelte";

    import "./FavoritesGrid.css";

    interface FavoriteAlbum {
        id: number;
        albumId: string;
        albumName: string;
        albumImage?: string;
        albumTracks: string;
        albumReleaseDate?: string;
        favoritedAt: string;
    }

    export let favorites: FavoriteAlbum[];

    const dispatch = createEventDispatcher();

    function handleOpenSpotify(event: CustomEvent<string>) {
        dispatch("openSpotify", event.detail);
    }

    function handleRemove(event: CustomEvent<string>) {
        dispatch("remove", event.detail);
    }
</script>

<div class="favorites-grid">
    {#each favorites as fav (fav.id)}
        <AlbumCard
            albumId={fav.albumId}
            albumName={fav.albumName}
            albumImage={fav.albumImage}
            albumTracks={fav.albumTracks}
            favoritedAt={fav.favoritedAt}
            on:openSpotify={handleOpenSpotify}
            on:remove={handleRemove}
        />
    {/each}
</div>
