<script lang="ts">
    import AlbumTimeline from "./AlbumTimeline.svelte";
    export let artistId: string = "";
</script>

<AlbumTimeline {artistId} />
