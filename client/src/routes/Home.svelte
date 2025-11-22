<script lang="ts">
    import SearchInput from "../components/home/SearchInput.svelte";
    import ArtistList from "../components/home/artists/ArtistList.svelte";
    import ArtistDetails from "../components/home/artists/ArtistDetails.svelte";
    import Timeline from "../components/home/timeline/Timeline.svelte";
    import Loading from "../components/utils/Loading.svelte";
    import Sidebar from "../components/Sidebar.svelte";
    import AuthModal from "../components/home/AuthModal.svelte";
    import WelcomeSection from "../components/home/WelcomeSection.svelte";
    import BrandTitle from "../components/titles/BrandTitle.svelte";
    import Header from "../components/Header.svelte";
    import loadArtistFromURL from "../App.svelte";

    import {
        searchArtists,
        getArtistData,
        saveSearchHistory,
    } from "../lib/data";
    import { auth } from "../lib/stores/auth";
    import { t } from "../lib/stores/language";
    import { setQueryParams, getQueryParam } from "../lib/urlState";
    import type { SearchArtistResult, SpotifyArtist } from "../types/artist";

    let query = "";
    let artists: SearchArtistResult[] = [];
    let selectedArtist: SpotifyArtist | null = null;
    let showOverlay = false;
    let loading = false;
    let showTimeline = false;
    let sidebarOpen = false;
    let showAuthModal = false;
    let authMode: "login" | "register" = "login";
    $: authState = $auth;

    async function handleInput() {
        if (!authState.isAuthenticated) {
            showAuthModal = true;
            authMode = "login";
            return;
        }

        setQueryParams({ q: query || null });

        const result = await searchArtists(query);
        artists = result.artists || [];
        showOverlay = artists.length > 0;
    }

    async function handleSelectArtist(event: CustomEvent<SearchArtistResult>) {
        if (!authState.isAuthenticated) {
            showAuthModal = true;
            authMode = "login";
            return;
        }

        const artist = event.detail;
        query = artist.name;
        showOverlay = false;
        loading = true;
        selectedArtist = null;
        showTimeline = false;

        setQueryParams({
            artist: artist.id,
            q: artist.name,
        });

        await saveSearchHistory(artist.id, artist.name, artist.image);

        try {
            selectedArtist = await getArtistData(artist.id);
        } catch (error) {
            console.error("Erro ao buscar dados do artista:", error);
        } finally {
            loading = false;
        }
    }

    function handleShowTimeline() {
        if (!authState.isAuthenticated) {
            showAuthModal = true;
            authMode = "login";
            return;
        }
        showTimeline = true;
    }

    function handleBackToArtist() {
        showTimeline = false;
    }

    function handleFocus() {
        if (artists.length > 0) {
            showOverlay = true;
        }
    }

    function handleBlur() {
        setTimeout(() => {
            showOverlay = false;
        }, 200);
    }

    function toggleSidebar() {
        sidebarOpen = !sidebarOpen;
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

    function handleLogout() {
        auth.logout();
        selectedArtist = null;
        showTimeline = false;
        query = "";
        artists = [];
        setQueryParams({ artist: null, q: null });
    }

    function handleAuthModalClose() {
        showAuthModal = false;
    }

    function handleLoginSuccess() {
        showAuthModal = false;

        const artistId = getQueryParam("artist");
        if (artistId) {
            loadArtistFromURL(artistId);
        } else if (query) {
            handleInput();
        }
    }
</script>

<Sidebar bind:open={sidebarOpen} on:action={handleSidebarAction} />

<main class:sidebar-open={sidebarOpen}>
    <Header
        bind:sidebarOpen
        on:toggleSidebar={toggleSidebar}
        on:logout={handleLogout}
    />

    <BrandTitle size="large" />

    <div class="search-container">
        <SearchInput
            bind:value={query}
            on:input={handleInput}
            on:focus={handleFocus}
            on:blur={handleBlur}
            placeholder={authState.isAuthenticated
                ? t("searchArtistsPlaceholder")
                : t("loginToSearch")}
            disabled={!authState.isAuthenticated}
        />
        <ArtistList
            {artists}
            show={showOverlay}
            on:select={handleSelectArtist}
        />
    </div>

    {#if !authState.isAuthenticated}
        <WelcomeSection
            onLogin={() => {
                showAuthModal = true;
                authMode = "login";
            }}
            onRegister={() => {
                showAuthModal = true;
                authMode = "register";
            }}
        />
    {:else if loading}
        <Loading message={t("loading")} />
    {:else if selectedArtist}
        <ArtistDetails
            artist={selectedArtist}
            on:showTimeline={handleShowTimeline}
            on:selectRelatedArtist={handleSelectArtist}
        />
        <Timeline artistId={selectedArtist.id} on:back={handleBackToArtist} />
    {/if}
</main>

<AuthModal
    bind:open={showAuthModal}
    bind:mode={authMode}
    on:close={handleAuthModalClose}
    on:loginSuccess={handleLoginSuccess}
/>

<style>
    main {
        margin: 0 auto;
        padding: 0;
        transition: margin-left 0.3s ease;
        min-height: 100vh;
        background: var(--bg-primary);
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: 100vw;
        overflow-x: hidden;
    }

    main.sidebar-open {
        margin-left: 280px;
        width: calc(100% - 280px);
        max-width: calc(100vw - 280px);
    }

    .search-container {
        position: relative;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px 0px 40px;
    }

    @media (max-width: 768px) {
        main.sidebar-open {
            margin-left: 0;
        }

        .search-container {
            padding: 16px 20px 30px;
        }
    }

    @media (max-width: 480px) {
        .search-container {
            padding: 12px 16px 24px;
        }
    }
</style>
