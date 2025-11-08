<script lang="ts">
  import Header from "../components/Header.svelte";
  import type { SearchArtistResult, SpotifyArtist } from "../types/artist";
  import { auth } from "../lib/stores/auth";
  import { setQueryParams } from "../lib/urlState";

  let query = "";
  let artists: SearchArtistResult[] = [];
  let selectedArtist: SpotifyArtist | null = null;
  let showTimeline = false;
  let sidebarOpen = false;

  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
  }

  function handleLogout() {
    auth.logout();
    selectedArtist = null;
    showTimeline = false;
    query = "";
    artists = [];
    setQueryParams({ artist: null, q: null });
  }
</script>

<main>
  <Header
    bind:sidebarOpen
    on:toggleSidebar={toggleSidebar}
    on:logout={handleLogout}
  />
</main>
