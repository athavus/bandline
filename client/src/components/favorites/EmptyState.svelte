<script lang="ts">
    import Icon from "@iconify/svelte";
    import { t } from "../../lib/stores/language";

    import "./EmptyState.css";
</script>

<div class="empty-state">
    <Icon icon="mdi:heart-outline" width="64" height="64" />
    <h3>{t("noFavoritesYet")}</h3>
    <p>Explore álbuns e adicione seus favoritos aqui!</p>
    <a href="/home" class="explore-button">
        <Icon icon="mdi:compass" width="20" height="20" />
        Explorar Álbuns
    </a>
</div>
