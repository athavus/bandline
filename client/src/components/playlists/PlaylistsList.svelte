<script lang="ts">
    import PlaylistsAlbumListItem from "./PlaylistsAlbumListItem.svelte";

    import { createEventDispatcher } from "svelte";

    interface CompletedAlbum {
        id: number;
        albumId: string;
        albumName: string;
        albumImage?: string;
        albumTracks: string;
        completedAt: string;
    }

    export let albums: CompletedAlbum[] = [];

    const dispatch = createEventDispatcher();

    function handleOpenSpotify(event: CustomEvent<string>) {
        dispatch("openSpotify", event.detail);
    }

    function handleRemove(event: CustomEvent<string>) {
        dispatch("remove", event.detail);
    }

    // Debug
    $: console.log(
        "PlaylistsList - albums:",
        albums,
        "length:",
        albums?.length,
    );
</script>

<div class="playlists-list">
    {#if albums && albums.length > 0}
        {#each albums as album (album.id)}
            <PlaylistsAlbumListItem
                albumId={album.albumId}
                albumName={album.albumName}
                albumImage={album.albumImage}
                albumTracks={album.albumTracks}
                completedAt={album.completedAt}
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
    .playlists-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
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
