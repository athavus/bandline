<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import SpotifyButton from "../../utils/SpotifyButton.svelte";
    import { t } from "../../../lib/stores/language";
    import Icon from "@iconify/svelte";
    import "./AlbumCoverEffect.css";
    import "./AlbumCard.css";

    export let album: any;
    export let position: number;
    export let active: boolean = false;
    export let isFavorite: boolean = false;

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

            console.log("=== DEBUG FAVORITOS ===");
            console.log("URL completa:", url);
            console.log("Método:", method);
            console.log("Album ID:", album.id);
            console.log("Album Name:", album.name);
            console.log("Total Tracks:", album.total_tracks);
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

            console.log("Status da resposta:", response.status);
            console.log("Headers:", response.headers.get("content-type"));

            const contentType = response.headers.get("content-type");
            const text = await response.text();

            console.log("Resposta raw:", text);

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

            console.log("Dados parseados:", data);

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
            <button class="icon-btn completed" aria-label="Mark as completed">
                <Icon icon="mdi:check-circle" width="24" height="24" />
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
