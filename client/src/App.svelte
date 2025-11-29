<script lang="ts">
    import { onMount } from "svelte";
    import { location, path, init as initRouter } from "./lib/router";

    import Home from "./routes/Home.svelte";
    import History from "./routes/History.svelte";
    import Profile from "./routes/Profile.svelte";
    import Config from "./routes/Config.svelte";
    import Favorites from "./routes/Favorites.svelte";
    import Playlists from "./routes/Playlists.svelte";

    import { auth } from "./lib/stores/auth";
    import { initLanguage } from "./lib/stores/language";
    import { initURLState } from "./lib/urlState";

    const routes: Record<string, any> = {
        "/": Home,
        "/history": History,
        "/profile": Profile,
        "/config": Config,
        "/favorites": Favorites,
        "/playlist": Playlists,
    };

    // Obtém o path inicial diretamente da URL
    function getInitialPath(): string {
        if (typeof window === "undefined") return "/";
        return window.location.pathname;
    }
    
    // Inicializa o router (já inicializa automaticamente no módulo, mas garante)
    initRouter();
    
    // Inicializa com o path da URL atual
    let currentPath = getInitialPath();
    let CurrentComponent = routes[currentPath] || Home;

    onMount(async () => {
        initLanguage();
        await auth.checkAuth();
        initURLState();
        
        // Garante que o componente está correto após tudo inicializar
        const urlPath = getInitialPath();
        if (urlPath !== currentPath) {
            currentPath = urlPath;
            CurrentComponent = routes[currentPath] || Home;
        }
    });

    // Reativo: atualiza quando a rota muda (via store)
    $: {
        // Usa o path do store se disponível e diferente do atual
        if ($path && $path !== currentPath) {
            currentPath = $path;
            CurrentComponent = routes[currentPath] || Home;
        }
    }
</script>

<svelte:component this={CurrentComponent} />
