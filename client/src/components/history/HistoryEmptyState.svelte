<script lang="ts">
    import Icon from "@iconify/svelte";
    import { translations$ } from "../../lib/stores/language";
    import "./HistoryEmptyState.css";
</script>

<div class="empty-state">
    <div class="empty-icon-wrapper">
        <Icon icon="mdi:music-note-off" width="80" height="80" />
    </div>
    <h3>{$translations$.historyEmpty}</h3>
    <p>{$translations$.historyEmptyDescription}</p>
    <a href="/" class="explore-button">
        <Icon icon="mdi:magnify" width="20" height="20" />
        {$translations$.discoverArtists}
    </a>
</div>
