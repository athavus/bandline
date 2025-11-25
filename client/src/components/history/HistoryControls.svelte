<script lang="ts">
    import Icon from "@iconify/svelte";
    import { translations$ } from "../../lib/stores/language";

    import "./HistoryControls.css";

    export let viewMode: "grid" | "list";
    export let onViewModeChange: (mode: "grid" | "list") => void;
</script>

<div class="view-controls">
    <button
        class="view-button"
        class:active={viewMode === "grid"}
        on:click={() => onViewModeChange("grid")}
        title={$translations$.gridView}
    >
        <Icon icon="mdi:view-grid" width="20" height="20" />
    </button>
    <button
        class="view-button"
        class:active={viewMode === "list"}
        on:click={() => onViewModeChange("list")}
        title={$translations$.listView}
    >
        <Icon icon="mdi:view-list" width="20" height="20" />
    </button>
</div>
