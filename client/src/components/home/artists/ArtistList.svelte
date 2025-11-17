<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import ArtistItem from "./ArtistItem.svelte";
    import type { SearchArtistResult } from "../../../types/artist";
    import "./ArtistList.css";

    export let artists: SearchArtistResult[] = [];
    export let show = false;

    const dispatch = createEventDispatcher();

    function handleSelect(artist: SearchArtistResult) {
        dispatch("select", artist);
    }
</script>

{#if show && artists.length > 0}
    <div class="overlay">
        {#each artists as artist}
            <ArtistItem {artist} on:click={() => handleSelect(artist)} />
        {/each}
    </div>
{/if}
