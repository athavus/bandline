<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let open = false;

  const dispatch = createEventDispatcher();

  function handleClick() {
    dispatch("click");
  }
</script>

<div class="sidebar-overlay" class:open on:click={handleClick}></div>

<style>
  .sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 998;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
  }

  .sidebar-overlay.open {
    opacity: 1;
    visibility: visible;
  }

  @media (max-width: 768px) {
    .sidebar-overlay.open {
      display: block;
    }
  }
</style>
