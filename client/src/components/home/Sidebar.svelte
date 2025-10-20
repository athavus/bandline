<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { auth } from "../../lib/stores/auth";
  import BrandTitle from "./titles/BrandTitle.svelte";
  import SidebarOverlay from "./sidebar/SidebarOverlay.svelte";
  import SidebarHeader from "./sidebar/SidebarHeader.svelte";
  import AuthenticatedMenu from "./sidebar/AuthenticatedMenu.svelte";
  import UnauthenticatedMenu from "./sidebar/UnauthenticatedMenu.svelte";

  export let open = false;

  const dispatch = createEventDispatcher();

  $: authState = $auth;

  function handleAction(action: string) {
    dispatch("action", action);
  }

  function handleOverlayClick() {
    open = false;
  }

  function handleClose() {
    open = false;
  }
</script>

<SidebarOverlay {open} on:click={handleOverlayClick} />

<aside class="sidebar" class:open>
  <SidebarHeader on:close={handleClose}>
    <BrandTitle inline />
  </SidebarHeader>

  <div class="sidebar-content">
    {#if authState.isAuthenticated}
      <AuthenticatedMenu
        user={authState.user}
        on:action={(e) => handleAction(e.detail)}
      />
    {:else}
      <UnauthenticatedMenu on:action={(e) => handleAction(e.detail)} />
    {/if}
  </div>
</aside>

<style>
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 280px;
    background: var(--bg-card);
    border-right: 1.5px solid var(--border-color);
    z-index: 999;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    display: flex;
    flex-direction: column;
    box-shadow: var(--shadow-lg);
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .sidebar-content {
    flex: 1;
    padding: 20px 0;
    overflow-y: auto;
  }
</style>
