<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { t } from "../../lib/stores/language";
    import MenuSection from "./MenuSection.svelte";
    import MenuItem from "./MenuItem.svelte";
    import AuthPrompt from "./AuthPrompt.svelte";
    import { menuIcons } from "./menuIcons";

    const dispatch = createEventDispatcher();

    function handleAction(action: string) {
        dispatch("action", action);
    }
</script>

<MenuSection>
    <AuthPrompt />
</MenuSection>

<MenuSection>
    <MenuItem
        icon={menuIcons.login}
        label={t("login")}
        variant="primary"
        on:click={() => handleAction("login")}
    />
    <MenuItem
        icon={menuIcons.register}
        label={t("register")}
        variant="secondary"
        on:click={() => handleAction("register")}
    />
</MenuSection>

<MenuSection title={t("explore")}>
    <MenuItem icon={menuIcons.search} label={t("searchArtists")} disabled />
    <MenuItem icon={menuIcons.charts} label={t("topCharts")} disabled />
</MenuSection>
