<script lang="ts">
    import Icon from "@iconify/svelte";
    import { translations$ } from "../../lib/stores/language";

    import "./HistoryStats.css";

    export let totalArtists: number;
</script>

<div class="history-stats">
    <div class="stat-badge">
        <Icon icon="mdi:music" width="20" height="20" />
        <span
            >{totalArtists}
            {totalArtists === 1
                ? $translations$.artist
                : $translations$.artists}</span
        >
    </div>
</div>
