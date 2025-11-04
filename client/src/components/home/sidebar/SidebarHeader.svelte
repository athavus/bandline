<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import "./SidebarHeader.css";

  const dispatch = createEventDispatcher();

  function handleClose() {
    dispatch("close");
  }
</script>

<div class="sidebar-header">
  <div class="sidebar-logo">
    <slot />
  </div>
  <button class="sidebar-close" on:click={handleClose}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <line
        x1="18"
        y1="6"
        x2="6"
        y2="18"
        stroke="currentColor"
        stroke-width="2"
      />
      <line
        x1="6"
        y1="6"
        x2="18"
        y2="18"
        stroke="currentColor"
        stroke-width="2"
      />
    </svg>
  </button>
</div>
