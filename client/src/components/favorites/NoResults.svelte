<script lang="ts">
    import Icon from "@iconify/svelte";

    import "./NoResults.css";

    export let searchQuery: string;
</script>

<div class="no-results">
    <Icon icon="mdi:album" width="48" height="48" />
    <p>Nenhum álbum encontrado com "{searchQuery}"</p>
</div>
