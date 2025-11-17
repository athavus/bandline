<script lang="ts">
    import Header from "../components/Header.svelte";
    import Sidebar from "../components/Sidebar.svelte";
    import type { SearchArtistResult, SpotifyArtist } from "../types/artist";
    import { auth } from "../lib/stores/auth";
    import { setQueryParams } from "../lib/urlState";

    let query = "";
    let artists: SearchArtistResult[] = [];
    let selectedArtist: SpotifyArtist | null = null;
    let showTimeline = false;
    let sidebarOpen = false;
    let showAuthModal = false;
    let authMode: "login" | "register" = "login";

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

    function handleSidebarAction(event: CustomEvent<string>) {
        const action = event.detail;

        if (action === "login") {
            showAuthModal = true;
            authMode = "login";
        } else if (action === "register") {
            showAuthModal = true;
            authMode = "register";
        } else if (action === "logout") {
            handleLogout();
        }

        sidebarOpen = false;
    }
</script>

<Sidebar bind:open={sidebarOpen} on:action={handleSidebarAction} />

<main>
    <Header
        bind:sidebarOpen
        on:toggleSidebar={toggleSidebar}
        on:logout={handleLogout}
    />
</main>
