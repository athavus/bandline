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
    let isEditingProfile = false;
    let editBio = "";
    let editUsername = "";
    let editAvatarUrl = "";

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
            editUsername = profile?.username || "";
            editAvatarUrl = profile?.avatarUrl || "";
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

    async function saveProfile() {
        if (!profile) return;

        if (!editUsername.trim()) {
            alert("O nome de usuário não pode estar vazio.");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/profile`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: editUsername,
                    avatarUrl: editAvatarUrl || null,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Erro ao atualizar perfil");
            }

            const data = await response.json();
            profile.username = editUsername;
            profile.avatarUrl = editAvatarUrl || undefined;
            isEditingProfile = false;
        } catch (err: any) {
            console.error("Erro ao atualizar perfil:", err);
            alert(err.message || "Erro ao atualizar perfil.");
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

    function startEditingProfile() {
        editUsername = profile?.username || "";
        editAvatarUrl = profile?.avatarUrl || "";
        isEditingProfile = true;
    }

    function cancelEditingProfile() {
        editUsername = profile?.username || "";
        editAvatarUrl = profile?.avatarUrl || "";
        isEditingProfile = false;
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
                    {#if isEditingProfile}
                        <div class="avatar-edit">
                            {#if editAvatarUrl}
                                <img src={editAvatarUrl} alt="Preview" />
                            {:else}
                                <div class="avatar-placeholder">
                                    {editUsername.charAt(0).toUpperCase()}
                                </div>
                            {/if}
                        </div>
                    {:else if profile.avatarUrl}
                        <img src={profile.avatarUrl} alt={profile.username} />
                    {:else}
                        <div class="avatar-placeholder">
                            {profile.username.charAt(0).toUpperCase()}
                        </div>
                    {/if}
                </div>

                <div class="profile-info">
                    <span class="profile-label">Perfil</span>

                    {#if isEditingProfile}
                        <div class="profile-edit-form">
                            <div class="profile-edit-inputs">
                                <p class="artist-label">Nome do Usuário</p>
                                <input
                                    type="text"
                                    bind:value={editUsername}
                                    placeholder="Nome de usuário"
                                    class="username-input"
                                    maxlength="50"
                                />
                                <p class="artist-label url-photo">
                                    URL da foto de perfil
                                </p>
                                <input
                                    type="url"
                                    bind:value={editAvatarUrl}
                                    placeholder="URL da imagem de perfil (opcional)"
                                    class="avatar-input"
                                />
                            </div>

                            <div class="profile-edit-actions">
                                <button class="save-btn" on:click={saveProfile}>
                                    Salvar
                                </button>
                                <button
                                    class="cancel-btn"
                                    on:click={cancelEditingProfile}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    {:else}
                        <h1 class="profile-username">{profile.username}</h1>
                        <button
                            class="edit-profile-btn"
                            on:click={startEditingProfile}
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <path
                                    d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                                />
                                <path
                                    d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                                />
                            </svg>
                            Editar perfil
                        </button>
                    {/if}

                    {#if !isEditingProfile}
                        <div class="profile-stats">
                            <span
                                >{profile.favorites.length} álbuns favoritos</span
                            >
                            <span>•</span>
                            <span>Desde {formatDate(profile.createdAt)}</span>
                        </div>
                    {/if}
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

    @media (max-width: 1024px) and (min-width: 769px) {
        .profile-container {
            padding: 32px 18px;
        }

        .profile-header {
            gap: 20px;
        }

        .profile-avatar {
            width: 160px;
            height: 160px;
        }

        .profile-username {
            font-size: 56px;
        }
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
        box-shadow: var(--shadow-lg);
    }

    .profile-avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .avatar-placeholder {
        width: 100%;
        height: 100%;
        background: var(--gradient-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 64px;
        font-weight: 700;
        color: white;
    }

    .avatar-edit {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .avatar-edit img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
    }

    .profile-info {
        display: flex;
        flex-direction: column;
        gap: 8px;
        flex: 1;
    }

    .profile-label {
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        color: var(--text-secondary);
    }

    .profile-username {
        font-size: 72px;
        font-weight: 700;
        color: var(--text-primary);
        margin: 0;
        line-height: 1;
        font-family: var(--font-heading);
    }

    .profile-stats {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        color: var(--text-secondary);
        margin-top: 8px;
    }

    /* Profile Edit Form */
    .profile-edit-form {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-bottom: 2%;
        max-width: 500px;
    }

    .profile-edit-inputs {
        display: block ruby;
    }

    .username-input,
    .avatar-input {
        width: 80%;
        padding: 8px 8px;
        background: var(--bg-input);
        border: 1px solid var(--border-color);
        border-radius: 6px;
        margin-left: 12px;
        color: var(--text-primary);
        font-size: 16px;
        font-family: var(--font-primary);
        transition: all 0.2s;
    }

    .url-photo {
        margin-left: 5% !important;
    }

    .username-input:focus,
    .avatar-input:focus {
        outline: none;
        border-color: var(--accent-color);
        background: var(--bg-hover);
    }

    .username-input::placeholder,
    .avatar-input::placeholder {
        color: var(--text-tertiary);
    }

    .profile-edit-actions {
        display: flex;
        gap: 12px;
    }

    .edit-profile-btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        background: var(--bg-hover);
        border: 1px solid var(--border-color);
        border-radius: 20px;
        color: var(--text-primary);
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        margin-top: 12px;
    }

    .edit-profile-btn:hover {
        background: var(--bg-tertiary);
        border-color: var(--border-light);
        transform: scale(1.02);
    }

    .edit-profile-btn svg {
        flex-shrink: 0;
    }

    /* Bio Section */
    .bio-section {
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        padding: 24px;
        margin-bottom: 40px;
        box-shadow: var(--shadow-sm);
    }

    .bio-display {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 16px;
    }

    .bio-text {
        flex: 1;
        color: var(--text-primary);
        font-size: 16px;
        line-height: 1.6;
        margin: 0;
    }

    .bio-empty {
        flex: 1;
        color: var(--text-tertiary);
        font-size: 16px;
        font-style: italic;
        margin: 0;
    }

    .edit-bio-btn {
        padding: 8px 16px;
        background: var(--bg-hover);
        border: 1px solid var(--border-color);
        border-radius: 20px;
        color: var(--text-primary);
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
    }

    .edit-bio-btn:hover {
        background: var(--bg-tertiary);
        border-color: var(--border-light);
        transform: scale(1.02);
    }

    .bio-edit textarea {
        width: 100%;
        min-height: 100px;
        padding: 12px;
        background: var(--bg-input);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        color: var(--text-primary);
        font-size: 16px;
        font-family: var(--font-primary);
        resize: vertical;
        margin-bottom: 12px;
        transition: border-color 0.2s;
    }

    .bio-edit textarea:focus {
        outline: none;
        border-color: var(--accent-color);
    }

    .bio-edit textarea::placeholder {
        color: var(--text-tertiary);
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
        background: var(--accent-color);
        color: white;
    }

    .save-btn:hover {
        background: var(--accent-hover);
        transform: scale(1.05);
    }

    .cancel-btn {
        background: var(--bg-hover);
        color: var(--text-primary);
        border: 1px solid var(--border-color);
    }

    .cancel-btn:hover {
        background: var(--bg-tertiary);
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
        color: var(--text-primary);
        margin: 0;
    }

    .see-all {
        color: var(--text-secondary);
        font-size: 14px;
        font-weight: 600;
        text-decoration: none;
        transition: color 0.2s;
    }

    .see-all:hover {
        color: var(--text-primary);
    }

    /* Albums Grid */
    .albums-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 24px;
    }

    .album-card {
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 16px;
        cursor: pointer;
        transition: all 0.3s;
        box-shadow: var(--shadow-sm);
    }

    .album-card:hover {
        background: var(--bg-hover);
        border-color: var(--border-light);
        transform: translateY(-4px);
        box-shadow: var(--shadow-md);
    }

    .album-image {
        width: 100%;
        aspect-ratio: 1;
        object-fit: cover;
        border-radius: 4px;
        margin-bottom: 12px;
        box-shadow: var(--shadow-sm);
    }

    .album-placeholder {
        width: 100%;
        aspect-ratio: 1;
        background: var(--bg-tertiary);
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 12px;
        color: var(--text-tertiary);
    }

    .album-info {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .album-name {
        font-size: 16px;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .album-tracks {
        font-size: 14px;
        color: var(--text-secondary);
        margin: 0;
    }

    /* History Grid */
    .history-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 24px;
    }

    .artist-card {
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 16px;
        cursor: pointer;
        transition: all 0.3s;
        box-shadow: var(--shadow-sm);
    }

    .artist-card:hover {
        background: var(--bg-hover);
        border-color: var(--border-light);
        transform: translateY(-4px);
        box-shadow: var(--shadow-md);
    }

    .artist-image {
        width: 100%;
        aspect-ratio: 1;
        object-fit: cover;
        border-radius: 50%;
        margin-bottom: 12px;
        box-shadow: var(--shadow-sm);
    }

    .artist-placeholder {
        width: 100%;
        aspect-ratio: 1;
        background: var(--bg-tertiary);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 12px;
        color: var(--text-tertiary);
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
        color: var(--text-primary);
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .artist-label {
        font-size: 14px;
        color: var(--text-secondary);
        margin: 0;
    }

    /* Empty State */
    .empty-profile {
        text-align: center;
        padding: 80px 20px;
        color: var(--text-secondary);
    }

    .empty-profile svg {
        margin-bottom: 24px;
        opacity: 0.5;
        stroke: var(--text-secondary);
    }

    .empty-profile h3 {
        font-size: 24px;
        font-weight: 600;
        color: var(--text-primary);
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
        color: var(--error-color);
        font-size: 18px;
        margin-bottom: 24px;
    }

    .retry-btn {
        padding: 12px 32px;
        background: var(--accent-color);
        color: white;
        border: none;
        border-radius: 24px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
    }

    .retry-btn:hover {
        background: var(--accent-hover);
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
            gap: 16px;
        }

        .profile-avatar {
            width: 140px;
            height: 140px;
        }

        .profile-username {
            font-size: 48px;
        }

        .profile-edit-form {
            max-width: 100%;
        }

        .profile-edit-inputs {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .username-input,
        .avatar-input {
            width: 100%;
            margin-left: 0;
        }

        .url-photo {
            margin-left: 0 !important;
        }

        .albums-grid,
        .history-grid {
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
            gap: 16px;
        }

        .bio-display {
            flex-direction: column;
            gap: 12px;
        }

        .bio-section {
            padding: 20px;
        }

        .section-header h2 {
            font-size: 24px;
        }

        .avatar-placeholder {
            font-size: 48px;
        }
    }

    @media (max-width: 480px) {
        .profile-container {
            padding: 20px 12px;
        }

        .profile-avatar {
            width: 120px;
            height: 120px;
        }

        .profile-username {
            font-size: 36px;
        }

        .profile-stats {
            flex-direction: column;
            gap: 4px;
            align-items: center;
        }

        .albums-grid,
        .history-grid {
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            gap: 12px;
        }

        .section-header h2 {
            font-size: 20px;
        }

        .avatar-placeholder {
            font-size: 40px;
        }

        .bio-section {
            padding: 16px;
        }

        .bio-text,
        .bio-empty {
            font-size: 14px;
        }
    }
</style>
