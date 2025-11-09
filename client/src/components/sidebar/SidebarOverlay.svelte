<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import "./SidebarOverlay.css";

  export let open = false;

  const dispatch = createEventDispatcher();

  function handleClick() {
    dispatch("click");
  }
</script>

<div class="sidebar-overlay" class:open on:click={handleClick}></div>
