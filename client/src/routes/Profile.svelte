<script lang="ts">
    import { onMount } from "svelte";
    import Header from "../components/Header.svelte";
    import Sidebar from "../components/Sidebar.svelte";
    import BrandSubtitle from "../components/titles/BrandSubtitle.svelte";
    import Loading from "../components/utils/Loading.svelte";
    import { auth } from "../lib/stores/auth";
    import { t } from "../lib/stores/language";
    import { replace } from "../lib/router";

    interface History {
        id: number;
        artistId: string;
        artistName: string;
        artistAvatar?: string;
        searchedAt: string;
    }

    interface Favorite {
        id: number;
        albumId: string;
        albumName: string;
        albumImage?: string;
        albumTracks: string;
        favoritedAt: string;
    }

    interface Profile {
        id: number;
        username: string;
        email: string;
        bio?: string;
        avatarUrl?: string;
        createdAt: string;
        histories: History[];
        favorites: Favorite[];
    }

    const API_URL = import.meta.env.VITE_API_URL;

    let profile: Profile | null = null;
    let loading = true;
    let error: string | null = null;
    let sidebarOpen = false;
    let isEditing = false;
    let editBio = "";

    $: authState = $auth;
    $: pinnedFavorites = profile?.favorites.slice(0, 6) || [];
    $: recentHistory = profile?.histories.slice(0, 10) || [];

    onMount(async () => {
        await auth.checkAuth();

        if (!$auth.isAuthenticated) {
            replace("/");
            return;
        }

        await fetchProfile();
    });

    async function fetchProfile() {
        loading = true;
        error = null;

        try {
            const response = await fetch(`${API_URL}/profile`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 401) {
                auth.logout();
                window.location.href = "/";
                return;
            }

            if (!response.ok) {
                throw new Error(`Erro ao buscar perfil: ${response.status}`);
            }

            const data = await response.json();
            profile = data.profile;
            editBio = profile?.bio || "";
        } catch (err) {
            console.error("Erro ao buscar perfil:", err);
            error = "Não foi possível carregar o perfil.";
        } finally {
            loading = false;
        }
    }

    async function saveBio() {
        if (!profile) return;

        try {
            const response = await fetch(`${API_URL}/profile`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ bio: editBio }),
            });

            if (!response.ok) {
                throw new Error("Erro ao atualizar bio");
            }

            const data = await response.json();
            profile.bio = editBio;
            isEditing = false;
        } catch (err) {
            console.error("Erro ao atualizar bio:", err);
            alert("Erro ao atualizar bio.");
        }
    }

    function toggleSidebar() {
        sidebarOpen = !sidebarOpen;
    }

    function handleSidebarAction(event: CustomEvent<string>) {
        const action = event.detail;
        if (action === "logout") {
            auth.logout();
            window.location.href = "/";
        }
        sidebarOpen = false;
    }

    function openAlbumInSpotify(albumId: string) {
        window.open(`https://open.spotify.com/album/${albumId}`, "_blank");
    }

    function openArtistInSpotify(artistId: string) {
        window.open(`https://open.spotify.com/artist/${artistId}`, "_blank");
    }

    function formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString("pt-BR", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }
</script>

<Sidebar bind:open={sidebarOpen} on:action={handleSidebarAction} />

<main class:sidebar-open={sidebarOpen}>
    <Header bind:sidebarOpen on:toggleSidebar={toggleSidebar} />

    <div class="profile-container">
        {#if loading}
            <Loading message="Carregando perfil..." />
        {:else if error}
            <div class="error-state">
                <p class="error-message">{error}</p>
                <button class="retry-btn" on:click={fetchProfile}>
                    Tentar novamente
                </button>
            </div>
        {:else if profile}
            <!-- Profile Header -->
            <div class="profile-header">
                <div class="profile-avatar">
                    {#if profile.avatarUrl}
                        <img src={profile.avatarUrl} alt={profile.username} />
                    {:else}
                        <div class="avatar-placeholder">
                            {profile.username.charAt(0).toUpperCase()}
                        </div>
                    {/if}
                </div>

                <div class="profile-info">
                    <span class="profile-label">Perfil</span>
                    <h1 class="profile-username">{profile.username}</h1>

                    <div class="profile-stats">
                        <span>{profile.favorites.length} álbuns favoritos</span>
                        <span>•</span>
                        <span>Desde {formatDate(profile.createdAt)}</span>
                    </div>
                </div>
            </div>

            <!-- Bio Section -->
            <div class="bio-section">
                {#if isEditing}
                    <div class="bio-edit">
                        <textarea
                            bind:value={editBio}
                            placeholder="Escreva algo sobre você..."
                            maxlength="200"
                        ></textarea>
                        <div class="bio-actions">
                            <button class="save-btn" on:click={saveBio}>
                                Salvar
                            </button>
                            <button
                                class="cancel-btn"
                                on:click={() => {
                                    isEditing = false;
                                    editBio = profile?.bio || "";
                                }}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                {:else}
                    <div class="bio-display">
                        {#if profile.bio}
                            <p class="bio-text">{profile.bio}</p>
                        {:else}
                            <p class="bio-empty">Sem bio ainda</p>
                        {/if}
                        <button
                            class="edit-bio-btn"
                            on:click={() => (isEditing = true)}
                        >
                            Editar bio
                        </button>
                    </div>
                {/if}
            </div>

            <!-- Pinned Favorites -->
            {#if pinnedFavorites.length > 0}
                <section class="content-section">
                    <div class="section-header">
                        <h2>Álbuns Favoritos</h2>
                        {#if profile.favorites.length > 6}
                            <a href="/favorites" class="see-all">Ver todos</a>
                        {/if}
                    </div>

                    <div class="albums-grid">
                        {#each pinnedFavorites as favorite}
                            <div
                                class="album-card"
                                on:click={() =>
                                    openAlbumInSpotify(favorite.albumId)}
                                on:keydown={(e) =>
                                    e.key === "Enter" &&
                                    openAlbumInSpotify(favorite.albumId)}
                                role="button"
                                tabindex="0"
                            >
                                {#if favorite.albumImage}
                                    <img
                                        src={favorite.albumImage}
                                        alt={favorite.albumName}
                                        class="album-image"
                                    />
                                {:else}
                                    <div class="album-placeholder">
                                        <svg
                                            width="48"
                                            height="48"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                        >
                                            <path
                                                d="M9 18V5l12-2v13M9 18c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3zm12-2c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z"
                                            />
                                        </svg>
                                    </div>
                                {/if}
                                <div class="album-info">
                                    <h3 class="album-name">
                                        {favorite.albumName}
                                    </h3>
                                    <p class="album-tracks">
                                        {favorite.albumTracks} faixas
                                    </p>
                                </div>
                            </div>
                        {/each}
                    </div>
                </section>
            {/if}

            <!-- Recent History -->
            {#if recentHistory.length > 0}
                <section class="content-section">
                    <div class="section-header">
                        <h2>Histórico Recente</h2>
                    </div>

                    <div class="history-grid">
                        {#each recentHistory as history}
                            <div
                                class="artist-card"
                                on:click={() =>
                                    openArtistInSpotify(history.artistId)}
                                on:keydown={(e) =>
                                    e.key === "Enter" &&
                                    openArtistInSpotify(history.artistId)}
                                role="button"
                                tabindex="0"
                            >
                                {#if history.artistAvatar}
                                    <img
                                        src={history.artistAvatar}
                                        alt={history.artistName}
                                        class="artist-image"
                                    />
                                {:else}
                                    <div class="artist-placeholder">
                                        <svg
                                            width="48"
                                            height="48"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                        >
                                            <path
                                                d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                                            />
                                            <circle cx="12" cy="7" r="4" />
                                        </svg>
                                    </div>
                                {/if}
                                <div class="artist-info">
                                    <h3 class="artist-name">
                                        {history.artistName}
                                    </h3>
                                    <p class="artist-label">Artista</p>
                                </div>
                            </div>
                        {/each}
                    </div>
                </section>
            {/if}

            {#if pinnedFavorites.length === 0 && recentHistory.length === 0}
                <div class="empty-profile">
                    <svg
                        width="64"
                        height="64"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" />
                    </svg>
                    <h3>Seu perfil está vazio</h3>
                    <p>Comece a explorar e adicionar álbuns aos favoritos!</p>
                </div>
            {/if}
        {/if}
    </div>
</main>

<style>
    main {
        min-height: 100vh;
        background: var(--bg-gradient-primary);
        padding-bottom: 40px;
    }

    .profile-container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 40px 20px;
    }

    /* Profile Header */
    .profile-header {
        display: flex;
        align-items: flex-end;
        gap: 24px;
        margin-bottom: 32px;
        padding: 0 0 24px 0;
    }

    .profile-avatar {
        width: 180px;
        height: 180px;
        border-radius: 50%;
        overflow: hidden;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    }

    .profile-avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .avatar-placeholder {
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #1db954 0%, #1ed760 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 64px;
        font-weight: 700;
        color: white;
    }

    .profile-info {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .profile-label {
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.7);
    }

    .profile-username {
        font-size: 72px;
        font-weight: 700;
        color: white;
        margin: 0;
        line-height: 1;
    }

    .profile-stats {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.7);
        margin-top: 8px;
    }

    /* Bio Section */
    .bio-section {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        padding: 24px;
        margin-bottom: 40px;
        backdrop-filter: blur(10px);
    }

    .bio-display {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 16px;
    }

    .bio-text {
        flex: 1;
        color: rgba(255, 255, 255, 0.9);
        font-size: 16px;
        line-height: 1.6;
        margin: 0;
    }

    .bio-empty {
        flex: 1;
        color: rgba(255, 255, 255, 0.4);
        font-size: 16px;
        font-style: italic;
        margin: 0;
    }

    .edit-bio-btn {
        padding: 8px 16px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 20px;
        color: white;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
    }

    .edit-bio-btn:hover {
        background: rgba(255, 255, 255, 0.2);
        border-color: rgba(255, 255, 255, 0.3);
    }

    .bio-edit textarea {
        width: 100%;
        min-height: 100px;
        padding: 12px;
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        color: white;
        font-size: 16px;
        font-family: inherit;
        resize: vertical;
        margin-bottom: 12px;
    }

    .bio-edit textarea:focus {
        outline: none;
        border-color: #1db954;
    }

    .bio-actions {
        display: flex;
        gap: 12px;
    }

    .save-btn,
    .cancel-btn {
        padding: 10px 24px;
        border-radius: 20px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        border: none;
    }

    .save-btn {
        background: #1db954;
        color: white;
    }

    .save-btn:hover {
        background: #1ed760;
        transform: scale(1.05);
    }

    .cancel-btn {
        background: rgba(255, 255, 255, 0.1);
        color: white;
    }

    .cancel-btn:hover {
        background: rgba(255, 255, 255, 0.2);
    }

    /* Content Sections */
    .content-section {
        margin-bottom: 48px;
    }

    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
    }

    .section-header h2 {
        font-size: 28px;
        font-weight: 700;
        color: white;
        margin: 0;
    }

    .see-all {
        color: rgba(255, 255, 255, 0.7);
        font-size: 14px;
        font-weight: 600;
        text-decoration: none;
        transition: color 0.2s;
    }

    .see-all:hover {
        color: white;
    }

    /* Albums Grid */
    .albums-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 24px;
    }

    .album-card {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        padding: 16px;
        cursor: pointer;
        transition: all 0.3s;
        backdrop-filter: blur(10px);
    }

    .album-card:hover {
        background: rgba(255, 255, 255, 0.1);
        transform: translateY(-4px);
    }

    .album-image {
        width: 100%;
        aspect-ratio: 1;
        object-fit: cover;
        border-radius: 4px;
        margin-bottom: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    .album-placeholder {
        width: 100%;
        aspect-ratio: 1;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 12px;
        color: rgba(255, 255, 255, 0.4);
    }

    .album-info {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .album-name {
        font-size: 16px;
        font-weight: 600;
        color: white;
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .album-tracks {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.6);
        margin: 0;
    }

    /* History Grid */
    .history-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 24px;
    }

    .artist-card {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        padding: 16px;
        cursor: pointer;
        transition: all 0.3s;
        backdrop-filter: blur(10px);
    }

    .artist-card:hover {
        background: rgba(255, 255, 255, 0.1);
        transform: translateY(-4px);
    }

    .artist-image {
        width: 100%;
        aspect-ratio: 1;
        object-fit: cover;
        border-radius: 50%;
        margin-bottom: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    .artist-placeholder {
        width: 100%;
        aspect-ratio: 1;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 12px;
        color: rgba(255, 255, 255, 0.4);
    }

    .artist-info {
        display: flex;
        flex-direction: column;
        gap: 4px;
        text-align: center;
    }

    .artist-name {
        font-size: 16px;
        font-weight: 600;
        color: white;
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .artist-label {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.6);
        margin: 0;
    }

    /* Empty State */
    .empty-profile {
        text-align: center;
        padding: 80px 20px;
        color: rgba(255, 255, 255, 0.6);
    }

    .empty-profile svg {
        margin-bottom: 24px;
        opacity: 0.5;
    }

    .empty-profile h3 {
        font-size: 24px;
        font-weight: 600;
        color: white;
        margin: 0 0 12px 0;
    }

    .empty-profile p {
        font-size: 16px;
        margin: 0;
    }

    /* Error State */
    .error-state {
        text-align: center;
        padding: 80px 20px;
    }

    .error-message {
        color: #ff6b6b;
        font-size: 18px;
        margin-bottom: 24px;
    }

    .retry-btn {
        padding: 12px 32px;
        background: #1db954;
        color: white;
        border: none;
        border-radius: 24px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
    }

    .retry-btn:hover {
        background: #1ed760;
        transform: scale(1.05);
    }

    /* Responsive */
    @media (max-width: 768px) {
        .profile-container {
            padding: 24px 16px;
        }

        .profile-header {
            flex-direction: column;
            align-items: center;
            text-align: center;
        }

        .profile-avatar {
            width: 140px;
            height: 140px;
        }

        .profile-username {
            font-size: 48px;
        }

        .albums-grid,
        .history-grid {
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
            gap: 16px;
        }

        .bio-display {
            flex-direction: column;
        }
    }
</style>
