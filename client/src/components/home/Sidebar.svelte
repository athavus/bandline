<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { auth } from "../../lib/stores/auth";
  import { replace } from "svelte-spa-router";
  import BrandTitle from "./titles/BrandTitle.svelte";
  import SidebarOverlay from "./sidebar/SidebarOverlay.svelte";
  import SidebarHeader from "./sidebar/SidebarHeader.svelte";
  import AuthenticatedMenu from "./sidebar/AuthenticatedMenu.svelte";
  import UnauthenticatedMenu from "./sidebar/UnauthenticatedMenu.svelte";
  import "./Sidebar.css";

  export let open = false;

  const dispatch = createEventDispatcher();

  $: authState = $auth;

  function handleAction(action: string) {
    dispatch("action", action);
  }

  function handleOverlayClick() {
    open = false;
  }

  function goHome() {
    replace("/");
  }

  function handleClose() {
    open = false;
  }
</script>

<SidebarOverlay {open} on:click={handleOverlayClick} />

<aside class="sidebar" class:open>
  <SidebarHeader on:close={handleClose}>
    <BrandTitle on:click={goHome} inline />
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
