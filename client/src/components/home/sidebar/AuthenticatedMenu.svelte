<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { t } from "../../../lib/stores/language";
  import MenuSection from "./MenuSection.svelte";
  import MenuItem from "./MenuItem.svelte";
  import UserInfo from "./UserInfo.svelte";
  import { menuIcons } from "./menuIcons";

  export let user: {
    username?: string;
    email?: string;
    avatarUrl?: string;
  } | null = null;

  const dispatch = createEventDispatcher();

  function handleAction(action: string) {
    dispatch("action", action);
  }
</script>

<MenuSection>
  <UserInfo {user} />
</MenuSection>

<MenuSection title={t("menu")}>
  <MenuItem
    icon={menuIcons.favorites}
    label={t("favorites")}
    on:click={() => handleAction("favorites")}
  />
  <MenuItem
    icon={menuIcons.history}
    label={t("history")}
    on:click={() => handleAction("history")}
  />
  <MenuItem
    icon={menuIcons.playlists}
    label={t("completeAlbums")}
    on:click={() => handleAction("playlists")}
  />
</MenuSection>

<MenuSection title={t("account")}>
  <MenuItem
    icon={menuIcons.profile}
    label={t("profile")}
    on:click={() => handleAction("profile")}
  />
  <MenuItem
    icon={menuIcons.settings}
    label={t("settings")}
    on:click={() => handleAction("settings")}
  />
  <MenuItem
    icon={menuIcons.logout}
    label={t("logout")}
    variant="danger"
    on:click={() => handleAction("logout")}
  />
</MenuSection>
