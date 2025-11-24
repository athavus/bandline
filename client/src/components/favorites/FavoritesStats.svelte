<script lang="ts">
    import Icon from "@iconify/svelte";

    import "./FavoritesStats.css";

    export let totalFavorites: number;
    export let filteredCount: number;
</script>

<div class="favorites-stats">
    <Icon icon="mdi:heart" width="20" height="20" />
    <span>
        {filteredCount} de {totalFavorites}
        {totalFavorites === 1 ? "álbum" : "álbuns"}
    </span>
</div>
