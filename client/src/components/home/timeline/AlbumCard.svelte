<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import SpotifyButton from "../../utils/SpotifyButton.svelte";
    import { t } from "../../../lib/stores/language";
    import Icon from "@iconify/svelte";

    export let album: any;
    export let position: number;
    export let active: boolean = false;
    export let isFavorite: boolean = false;
    export let isCompleted: boolean = false;

    const dispatch = createEventDispatcher();

    function formatDate(dateString: string) {
        const date = new Date(
            dateString.length === 4
                ? `${dateString}-01-01`
                : dateString.length === 7
                  ? `${dateString}-01`
                  : dateString,
        );
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: dateString.length === 4 ? undefined : "long",
            day: dateString.length > 7 ? "numeric" : undefined,
        });
    }

    function handleClick() {
        dispatch("click");
    }

    function openAlbumInSpotify(e: Event) {
        e.stopPropagation();
        window.open(`https://open.spotify.com/album/${album.id}`, "_blank");
    }

    async function toggleFavorite(e: Event) {
        e.stopPropagation();

        try {
            const method = isFavorite ? "DELETE" : "POST";
            const url = "http://localhost:3000/favorites";

            console.log("=== TOGGLE FAVORITO ===");
            console.log("Método:", method);
            console.log("Album ID:", album.id);
            console.log("isFavorite atual:", isFavorite);

            const response = await fetch(url, {
                method,
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    albumId: album.id,
                    albumName: album.name,
                    albumImage: album.images?.[0]?.url ?? "",
                    albumTracks: album.total_tracks || 0,
                }),
            });

            const contentType = response.headers.get("content-type");
            const text = await response.text();

            // Se já está favoritado (409) e estamos tentando adicionar, apenas inverte o estado
            if (response.status === 409 && !isFavorite) {
                console.log("Álbum já favoritado, atualizando UI");
                isFavorite = true;
                dispatch("favoriteToggled", {
                    albumId: album.id,
                    isFavorite: true,
                });
                return;
            }

            if (!response.ok) {
                let errorMessage = "Erro ao favoritar álbum";
                try {
                    const errorData = text ? JSON.parse(text) : {};
                    errorMessage = errorData.error || errorMessage;
                } catch (e) {
                    errorMessage = text || errorMessage;
                }
                throw new Error(errorMessage);
            }

            let data = {};
            if (text && contentType?.includes("application/json")) {
                data = JSON.parse(text);
            }

            console.log("Resposta:", data);

            // Atualiza o estado
            isFavorite = !isFavorite;

            dispatch("favoriteToggled", {
                albumId: album.id,
                isFavorite,
            });

            console.log("Favorito atualizado com sucesso!");
        } catch (err) {
            console.error("Erro no toggleFavorite:", err);
            alert(`Erro: ${err.message}`);
        }
    }

    async function toggleCompleted(e: Event) {
        e.stopPropagation();

        try {
            const method = isCompleted ? "DELETE" : "POST";
            const url = "http://localhost:3000/completedAlbums";

            console.log("=== TOGGLE COMPLETADO ===");
            console.log("Método:", method);
            console.log("Album ID:", album.id);
            console.log("isCompleted atual:", isCompleted);

            const response = await fetch(url, {
                method,
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    albumId: album.id,
                    albumName: album.name,
                    albumImage: album.images?.[0]?.url ?? "",
                    albumTracks: album.total_tracks || 0,
                }),
            });

            const contentType = response.headers.get("content-type");
            const text = await response.text();

            // Se já está completado (409) e estamos tentando adicionar, apenas inverte o estado
            if (response.status === 409 && !isCompleted) {
                console.log("Álbum já completado, atualizando UI");
                isCompleted = true;
                dispatch("completedToggled", {
                    albumId: album.id,
                    isCompleted: true,
                });
                return;
            }

            if (!response.ok) {
                let errorMessage = "Erro ao marcar como completo";
                try {
                    const errorData = text ? JSON.parse(text) : {};
                    errorMessage = errorData.error || errorMessage;
                } catch (e) {
                    errorMessage = text || errorMessage;
                }
                throw new Error(errorMessage);
            }

            let data = {};
            if (text && contentType?.includes("application/json")) {
                data = JSON.parse(text);
            }

            console.log("Resposta:", data);

            // Atualiza o estado
            isCompleted = !isCompleted;

            dispatch("completedToggled", {
                albumId: album.id,
                isCompleted,
            });

            console.log("Completado atualizado com sucesso!");
        } catch (err) {
            console.error("Erro no toggleCompleted:", err);
            alert(`Erro: ${err.message}`);
        }
    }
</script>

<div
    class="album-item {active ? 'active' : ''}"
    style="left: {position}px"
    on:click={handleClick}
    on:keypress={(e) => e.key === "Enter" && handleClick()}
    role="button"
    tabindex="0"
>
    <div class="album-cover">
        {#if album.images?.length}
            <img src={album.images[0].url} alt={album.name} loading="lazy" />
        {:else}
            <div class="no-image">♫</div>
        {/if}
        <div class="album-actions">
            <button
                class="icon-btn completed"
                aria-label={isCompleted ? "Remove from completed" : "Mark as completed"}
                on:click={toggleCompleted}
                class:active={isCompleted}
            >
                <Icon
                    icon={isCompleted ? "mdi:check-circle-outline" : "mdi:check-circle"}
                    width="24"
                    height="24"
                />
            </button>
            <button
                class="icon-btn favorite"
                aria-label="Mark as favorite"
                on:click={toggleFavorite}
                class:active={isFavorite}
            >
                <Icon
                    icon={isFavorite ? "mdi:heart" : "mdi:heart-outline"}
                    width="24"
                    height="24"
                />
            </button>
        </div>
        <SpotifyButton on:click={openAlbumInSpotify} />
    </div>

    <div class="album-details">
        <h3 class="album-name">{album.name}</h3>
        <p class="album-year">{formatDate(album.release_date)}</p>
        {#if album.total_tracks > 1}
            <span class="album-badge">{album.total_tracks} {t("tracks")}</span>
        {:else if album.total_tracks === 1}
            <span class="album-badge">{album.total_tracks} {t("track")}</span>
        {/if}
    </div>
</div>

<style>
    .album-item {
        position: absolute;
        top: 0;
        width: 240px;
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 3;
    }

    .album-item:hover,
    .album-item.active {
        transform: translateY(-12px) scale(1.04);
        z-index: 5;
    }

    .album-cover {
        position: relative;
        width: 240px;
        height: 240px;
        border-radius: 20px;
        background: var(--bg-secondary);
        border: 3px solid var(--border-color);
        margin-bottom: 20px;
        overflow: visible;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: var(--shadow-md);
    }

    .album-item:hover .album-cover {
        border-color: var(--accent-color);
        box-shadow: var(--shadow-xl);
        transform: rotate(2deg);
    }

    .album-item:hover .album-cover img {
        transform: scale(1.1);
    }

    .album-cover img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.4s ease;
        border-radius: 17px;
    }

    .no-image {
        font-size: 3rem;
        color: var(--text-tertiary);
        font-weight: 900;
        transition: color 0.3s ease;
    }

    .album-actions {
        position: absolute;
        bottom: 60px; /* ajusta para ficar acima do SpotifyButton */
        right: 12px;
        display: flex;
        flex-direction: column; /* alinha os botões na vertical */
        gap: 12px;
        z-index: 10;
    }

    .icon-btn {
        background: rgba(0, 0, 0, 0.5);
        border: none;
        border-radius: 50%;
        padding: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition:
            background-color 0.3s ease,
            box-shadow 0.3s ease,
            transform 0.3s ease;
    }

    .icon-btn:hover {
        background: var(--accent-color);
        box-shadow: 0 0 8px var(--accent-color);
        transform: scale(1.1);
    }

    .icon-btn.completed {
        background: #1db954;
        border: 2px solid #1db954;
        transition: all 0.3s ease;
    }

    .icon-btn.completed:hover {
        background: #1ed760;
        box-shadow: 0 0 12px #1ed760;
        transform: scale(1.1);
    }

    .icon-btn.completed.active {
        background: transparent !important;
        box-shadow: none;
        border: 2px solid #1db954;
        transform: scale(1.05);
    }

    .icon-btn.completed.active:hover {
        background: rgba(29, 185, 84, 0.2) !important;
        box-shadow: 0 0 12px rgba(29, 185, 84, 0.3);
        transform: scale(1.15);
    }

    .icon-btn.favorite {
        background: rgba(220, 20, 60, 0.6);
    }

    .icon-btn.favorite:hover {
        background: #e22134;
        box-shadow: 0 0 12px #e22134;
    }

    .icon-btn.favorite.active {
        color: black;
        background: #e22134 !important;
        box-shadow: 0 0 16px #e22134;
        border: 2px solid #e22134;
        transform: scale(1.05);
    }

    .icon-btn.favorite.active:hover {
        background: #ff4757 !important;
        box-shadow: 0 0 20px #ff4757;
        transform: scale(1.15);
    }

    .album-details {
        text-align: center;
        width: 150px;
    }

    .album-name {
        font-family: var(--font-heading);
        font-size: 1.1rem;
        font-weight: 700;
        color: var(--text-primary);
        margin: 0 0 8px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        transition: color 0.3s ease;
    }

    .album-item.active .album-name {
        color: var(--accent-color);
    }

    .album-year {
        font-family: var(--font-primary);
        font-size: 0.9rem;
        color: var(--text-secondary);
        margin: 0 0 10px;
        font-weight: 500;
        transition: color 0.3s ease;
    }

    .album-item.active .album-year {
        color: var(--text-secondary);
    }

    .album-badge {
        font-family: var(--font-primary);
        font-size: 0.7rem;
        font-weight: 600;
        background: var(--accent-color);
        color: white;
        border: none;
        border-radius: 12px;
        padding: 4px 12px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        display: inline-block;
        transition: all 0.3s ease;
        box-shadow: var(--shadow-sm);
    }

    .album-item:hover .album-badge {
        background: var(--accent-hover);
        transform: translateY(-1px);
        box-shadow: var(--shadow-md);
    }

    @media (max-width: 1024px) {
        .album-item {
            width: 150px;
        }
        .album-cover {
            width: 140px;
            height: 140px;
            border-radius: 16px;
        }
        .album-cover img {
            border-radius: 13px;
        }
        .album-details {
            width: 130px;
        }
        .album-name {
            font-size: 1rem;
        }
        .album-year {
            font-size: 0.85rem;
        }
        .album-actions {
            bottom: 50px;
            gap: 10px;
        }
        .icon-btn {
            width: 40px;
            height: 40px;
            padding: 5px;
        }
        .album-item.active .album-cover::before {
            left: -15px;
            width: 35px;
            height: 80px;
        }
        .album-item.active .album-cover::after {
            right: -15px;
            width: 35px;
            height: 80px;
        }
    }

    @media (max-width: 768px) {
        .album-item {
            width: 120px;
        }
        .album-cover {
            width: 110px;
            height: 110px;
            border-radius: 16px;
        }
        .album-cover img {
            border-radius: 13px;
        }
        .album-details {
            width: 100px;
        }
        .album-name {
            font-size: 0.9rem;
        }
        .album-year {
            font-size: 0.8rem;
        }
        .album-badge {
            font-size: 0.65rem;
            padding: 3px 10px;
        }
        .album-actions {
            bottom: 45px;
            gap: 8px;
        }
        .icon-btn {
            width: 36px;
            height: 36px;
            padding: 4px;
        }
        .album-item.active .album-cover::before {
            left: -12px;
            width: 30px;
            height: 70px;
        }
        .album-item.active .album-cover::after {
            right: -12px;
            width: 30px;
            height: 70px;
        }
    }

    @media (max-width: 480px) {
        .album-item {
            width: 100px;
        }
        .album-cover {
            width: 90px;
            height: 90px;
            border-radius: 12px;
        }
        .album-cover img {
            border-radius: 9px;
        }
        .album-details {
            width: 85px;
        }
        .album-name {
            font-size: 0.8rem;
        }
        .album-year {
            font-size: 0.75rem;
        }
        .album-badge {
            font-size: 0.6rem;
            padding: 2px 8px;
        }
        .album-actions {
            bottom: 40px;
            gap: 6px;
        }
        .icon-btn {
            width: 32px;
            height: 32px;
            padding: 3px;
        }
        .album-item.active .album-cover::before {
            left: -5px;
            width: 4px;
        }
        .album-item.active .album-cover::after {
            right: -5px;
            width: 4px;
        }
    }

    /* ALBUM COVER EFFECTS */
    /* Audio spectrogram effect on active album - left side */
    .album-item.active .album-cover::before {
        content: "";
        position: absolute;
        bottom: 0;
        left: -170px !important;
        top: 0px;
        width: 220px !important;
        height: 250px !important;
        pointer-events: none;
        z-index: -1;
        background:
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 20%,
                    transparent 60%
                )
                4% 100% / 3px 20%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 30%,
                    transparent 30%
                )
                6% 100% / 3px 30%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 50%,
                    transparent 50%
                )
                8% 100% / 3px 50%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 40%,
                    transparent 70%
                )
                10% 100% / 3px 40%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 35%,
                    transparent 35%
                )
                12% 100% / 3px 35%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 55%,
                    transparent 55%
                )
                14% 100% / 3px 55%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 50%,
                    transparent 80%
                )
                16% 100% / 3px 40%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 25%,
                    transparent 25%
                )
                18% 100% / 3px 25%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 45%,
                    transparent 45%
                )
                20% 100% / 3px 45%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 50%,
                    transparent 65%
                )
                22% 100% / 3px 65%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 40%,
                    transparent 40%
                )
                24% 100% / 3px 40%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 55%,
                    transparent 60%
                )
                26% 100% / 3px 50%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 30%,
                    transparent 30%
                )
                28% 100% / 3px 30%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 50%,
                    transparent 50%
                )
                30% 100% / 3px 50%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 40%,
                    transparent 70%
                )
                32% 100% / 3px 20%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 35%,
                    transparent 35%
                )
                34% 100% / 3px 35%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 55%,
                    transparent 55%
                )
                36% 100% / 3px 55%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 30%,
                    transparent 80%
                )
                38% 100% / 3px 30%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 25%,
                    transparent 25%
                )
                40% 100% / 3px 25%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 45%,
                    transparent 45%
                )
                42% 100% / 3px 45%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 35%,
                    transparent 65%
                )
                44% 100% / 3px 15%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 40%,
                    transparent 40%
                )
                46% 100% / 3px 40%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 10%,
                    transparent 60%
                )
                48% 100% / 3px 20%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 30%,
                    transparent 30%
                )
                50% 100% / 3px 30%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 50%,
                    transparent 50%
                )
                52% 100% / 3px 50%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 40%,
                    transparent 70%
                )
                54% 100% / 3px 40%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 35%,
                    transparent 35%
                )
                56% 100% / 3px 35%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 55%,
                    transparent 55%
                )
                58% 100% / 3px 55%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 20%,
                    transparent 80%
                )
                60% 100% / 3px 30%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 25%,
                    transparent 25%
                )
                62% 100% / 3px 25%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 45%,
                    transparent 45%
                )
                64% 100% / 3px 45%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 35%,
                    transparent 65%
                )
                66% 100% / 3px 55%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 40%,
                    transparent 40%
                )
                68% 100% / 3px 40%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 50%,
                    transparent 60%
                )
                70% 100% / 3px 50%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 30%,
                    transparent 30%
                )
                72% 100% / 3px 30%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 50%,
                    transparent 50%
                )
                74% 100% / 3px 50%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 20%,
                    transparent 70%
                )
                76% 100% / 3px 40%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 35%,
                    transparent 35%
                )
                78% 100% / 3px 35%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 55%,
                    transparent 55%
                )
                80% 100% / 3px 55%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 30%,
                    transparent 80%
                )
                82% 100% / 3px 30%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 25%,
                    transparent 25%
                )
                84% 100% / 3px 25%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 45%,
                    transparent 45%
                )
                86% 100% / 3px 45%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 55%,
                    transparent 65%
                )
                88% 100% / 3px 15%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 40%,
                    transparent 40%
                )
                90% 100% / 3px 40%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 20%,
                    transparent 60%
                )
                92% 100% / 3px 50%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 30%,
                    transparent 30%
                )
                94% 100% / 3px 30%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 50%,
                    transparent 50%
                )
                96% 100% / 3px 50%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 55%,
                    transparent 75%
                )
                98% 100% / 3px 25%;
        background-repeat: no-repeat;
        animation: spectrogram-left 3s ease-in-out infinite;
        filter: blur(0.3px);
        transform: rotate(-90deg);
    }

    /* Right side spectrogram */
    .album-item.active .album-cover::after {
        content: "";
        position: absolute;
        bottom: 0;
        right: -170px !important;
        top: -10px;
        width: 220px !important;
        height: 250px !important;
        pointer-events: none;
        z-index: -1;
        background:
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 20%,
                    transparent 60%
                )
                4% 100% / 3px 20%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 30%,
                    transparent 30%
                )
                6% 100% / 3px 30%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 50%,
                    transparent 50%
                )
                8% 100% / 3px 50%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 40%,
                    transparent 70%
                )
                10% 100% / 3px 40%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 35%,
                    transparent 35%
                )
                12% 100% / 3px 35%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 55%,
                    transparent 55%
                )
                14% 100% / 3px 55%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 50%,
                    transparent 80%
                )
                16% 100% / 3px 40%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 25%,
                    transparent 25%
                )
                18% 100% / 3px 25%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 45%,
                    transparent 45%
                )
                20% 100% / 3px 45%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 50%,
                    transparent 65%
                )
                22% 100% / 3px 65%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 40%,
                    transparent 40%
                )
                24% 100% / 3px 40%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 55%,
                    transparent 60%
                )
                26% 100% / 3px 50%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 30%,
                    transparent 30%
                )
                28% 100% / 3px 30%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 50%,
                    transparent 50%
                )
                30% 100% / 3px 50%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 40%,
                    transparent 70%
                )
                32% 100% / 3px 20%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 35%,
                    transparent 35%
                )
                34% 100% / 3px 35%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 55%,
                    transparent 55%
                )
                36% 100% / 3px 55%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 30%,
                    transparent 80%
                )
                38% 100% / 3px 30%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 25%,
                    transparent 25%
                )
                40% 100% / 3px 25%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 45%,
                    transparent 45%
                )
                42% 100% / 3px 45%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 35%,
                    transparent 65%
                )
                44% 100% / 3px 15%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 40%,
                    transparent 40%
                )
                46% 100% / 3px 40%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 10%,
                    transparent 60%
                )
                48% 100% / 3px 20%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 30%,
                    transparent 30%
                )
                50% 100% / 3px 30%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 50%,
                    transparent 50%
                )
                52% 100% / 3px 50%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 40%,
                    transparent 70%
                )
                54% 100% / 3px 40%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 35%,
                    transparent 35%
                )
                56% 100% / 3px 35%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 55%,
                    transparent 55%
                )
                58% 100% / 3px 55%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 20%,
                    transparent 80%
                )
                60% 100% / 3px 30%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 25%,
                    transparent 25%
                )
                62% 100% / 3px 25%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 45%,
                    transparent 45%
                )
                64% 100% / 3px 45%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 35%,
                    transparent 65%
                )
                66% 100% / 3px 55%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 40%,
                    transparent 40%
                )
                68% 100% / 3px 40%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 50%,
                    transparent 60%
                )
                70% 100% / 3px 50%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 30%,
                    transparent 30%
                )
                72% 100% / 3px 30%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 50%,
                    transparent 50%
                )
                74% 100% / 3px 50%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 20%,
                    transparent 70%
                )
                76% 100% / 3px 40%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 35%,
                    transparent 35%
                )
                78% 100% / 3px 35%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 55%,
                    transparent 55%
                )
                80% 100% / 3px 55%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 30%,
                    transparent 80%
                )
                82% 100% / 3px 30%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 25%,
                    transparent 25%
                )
                84% 100% / 3px 25%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 45%,
                    transparent 45%
                )
                86% 100% / 3px 45%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 55%,
                    transparent 65%
                )
                88% 100% / 3px 15%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 40%,
                    transparent 40%
                )
                90% 100% / 3px 40%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 20%,
                    transparent 60%
                )
                92% 100% / 3px 50%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 30%,
                    transparent 30%
                )
                94% 100% / 3px 30%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 50%,
                    transparent 50%
                )
                96% 100% / 3px 50%,
            linear-gradient(
                    to top,
                    rgba(var(--accent-rgb), 0.9) 0%,
                    rgba(var(--accent-rgb), 0.9) 55%,
                    transparent 75%
                )
                98% 100% / 3px 25%;
        background-repeat: no-repeat;
        animation: spectrogram-right 3s ease-in-out infinite;
        filter: blur(0.3px);
        transform: rotate(90deg);
    }

    @keyframes spectrogram-left {
        0% {
            background-size:
                3px 30%,
                3px 50%,
                3px 40%,
                3px 70%,
                3px 35%,
                3px 60%,
                3px 45%,
                3px 80%,
                3px 25%,
                3px 55%;
        }
        10% {
            background-size:
                3px 50%,
                3px 35%,
                3px 70%,
                3px 45%,
                3px 60%,
                3px 30%,
                3px 75%,
                3px 40%,
                3px 55%,
                3px 65%;
        }
        20% {
            background-size:
                3px 40%,
                3px 65%,
                3px 50%,
                3px 30%,
                3px 70%,
                3px 45%,
                3px 60%,
                3px 35%,
                3px 75%,
                3px 50%;
        }
        30% {
            background-size:
                3px 70%,
                3px 45%,
                3px 35%,
                3px 80%,
                3px 50%,
                3px 65%,
                3px 40%,
                3px 55%,
                3px 30%,
                3px 60%;
        }
        40% {
            background-size:
                3px 35%,
                3px 75%,
                3px 60%,
                3px 40%,
                3px 55%,
                3px 50%,
                3px 70%,
                3px 45%,
                3px 65%,
                3px 35%;
        }
        50% {
            background-size:
                3px 60%,
                3px 40%,
                3px 70%,
                3px 55%,
                3px 45%,
                3px 75%,
                3px 35%,
                3px 65%,
                3px 50%,
                3px 40%;
        }
        60% {
            background-size:
                3px 45%,
                3px 70%,
                3px 35%,
                3px 65%,
                3px 80%,
                3px 40%,
                3px 55%,
                3px 50%,
                3px 60%,
                3px 75%;
        }
        70% {
            background-size:
                3px 75%,
                3px 50%,
                3px 65%,
                3px 35%,
                3px 60%,
                3px 70%,
                3px 45%,
                3px 30%,
                3px 80%,
                3px 55%;
        }
        80% {
            background-size:
                3px 50%,
                3px 60%,
                3px 45%,
                3px 75%,
                3px 40%,
                3px 55%,
                3px 65%,
                3px 70%,
                3px 35%,
                3px 50%;
        }
        90% {
            background-size:
                3px 65%,
                3px 35%,
                3px 80%,
                3px 50%,
                3px 70%,
                3px 45%,
                3px 30%,
                3px 60%,
                3px 55%,
                3px 40%;
        }
        100% {
            background-size:
                3px 30%,
                3px 50%,
                3px 40%,
                3px 70%,
                3px 35%,
                3px 60%,
                3px 45%,
                3px 80%,
                3px 25%,
                3px 55%;
        }
    }

    @keyframes spectrogram-right {
        0% {
            background-size:
                3px 45%,
                3px 65%,
                3px 30%,
                3px 75%,
                3px 40%,
                3px 55%,
                3px 35%,
                3px 70%,
                3px 50%,
                3px 60%;
        }
        10% {
            background-size:
                3px 65%,
                3px 40%,
                3px 70%,
                3px 50%,
                3px 60%,
                3px 45%,
                3px 75%,
                3px 35%,
                3px 55%,
                3px 50%;
        }
        20% {
            background-size:
                3px 35%,
                3px 75%,
                3px 50%,
                3px 40%,
                3px 65%,
                3px 60%,
                3px 45%,
                3px 55%,
                3px 70%,
                3px 35%;
        }
        30% {
            background-size:
                3px 80%,
                3px 50%,
                3px 65%,
                3px 45%,
                3px 55%,
                3px 70%,
                3px 40%,
                3px 60%,
                3px 35%,
                3px 75%;
        }
        40% {
            background-size:
                3px 50%,
                3px 70%,
                3px 40%,
                3px 65%,
                3px 50%,
                3px 35%,
                3px 75%,
                3px 45%,
                3px 60%,
                3px 55%;
        }
        50% {
            background-size:
                3px 70%,
                3px 35%,
                3px 75%,
                3px 55%,
                3px 45%,
                3px 65%,
                3px 50%,
                3px 70%,
                3px 40%,
                3px 60%;
        }
        60% {
            background-size:
                3px 40%,
                3px 60%,
                3px 55%,
                3px 70%,
                3px 75%,
                3px 50%,
                3px 65%,
                3px 35%,
                3px 80%,
                3px 45%;
        }
        70% {
            background-size:
                3px 65%,
                3px 45%,
                3px 60%,
                3px 35%,
                3px 70%,
                3px 75%,
                3px 50%,
                3px 80%,
                3px 55%,
                3px 40%;
        }
        80% {
            background-size:
                3px 55%,
                3px 75%,
                3px 45%,
                3px 60%,
                3px 50%,
                3px 40%,
                3px 70%,
                3px 65%,
                3px 35%,
                3px 55%;
        }
        90% {
            background-size:
                3px 70%,
                3px 50%,
                3px 80%,
                3px 45%,
                3px 65%,
                3px 55%,
                3px 35%,
                3px 75%,
                3px 60%,
                3px 40%;
        }
        100% {
            background-size:
                3px 45%,
                3px 65%,
                3px 30%,
                3px 75%,
                3px 40%,
                3px 55%,
                3px 35%,
                3px 70%,
                3px 50%,
                3px 60%;
        }
    }
</style>
