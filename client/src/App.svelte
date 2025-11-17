<script lang="ts">
    import { onMount } from "svelte";
    import Router from "svelte-spa-router";

    import Home from "./routes/Home.svelte";
    import History from "./routes/History.svelte";

    import { getArtistData } from "./lib/data";
    import { auth } from "./lib/stores/auth";
    import { initLanguage } from "./lib/stores/language";
    import {
        initURLState,
        setQueryParams,
        getQueryParam,
    } from "./lib/urlState";

    import type { SpotifyArtist } from "./types/artist";
    import Profile from "./routes/Profile.svelte";
    import Config from "./routes/Config.svelte";

    import Favorites from "./routes/Favorites.svelte";
    import Playlists from "./routes/Playlists.svelte";

    let query = "";
    let selectedArtist: SpotifyArtist | null = null;
    let loading = false;
    let showTimeline = false;
    $: authState = $auth;

    onMount(async () => {
        initLanguage();
        await auth.checkAuth();
        initURLState();

        const artistId = getQueryParam("artist");
        const urlQuery = getQueryParam("q");

        if (artistId && authState.isAuthenticated) {
            await loadArtistFromURL(artistId);
        }

        if (urlQuery) {
            query = urlQuery;
        }
    });

    export async function loadArtistFromURL(artistId: string) {
        if (!authState.isAuthenticated) return;

        loading = true;
        selectedArtist = null;
        showTimeline = false;

        try {
            selectedArtist = await getArtistData(artistId);
            query = selectedArtist.name;
        } catch (error) {
            console.error("Erro ao carregar artista da URL:", error);
            // Limpa a URL se houver erro
            setQueryParams({ artist: null, q: null });
        } finally {
            loading = false;
        }
    }

    const routes = {
        "/": Home,
        "/history": History,
        "/profile": Profile,
        "/config": Config,
        "/favorites": Favorites,
        "/playlist": Playlists,
    };
</script>

<Router {routes} />
