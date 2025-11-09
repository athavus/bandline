<script lang="ts">
  import { t } from "../../lib/stores/language";
  import "./UserInfo.css";

  export let user: {
    username?: string;
    email?: string;
    avatarUrl?: string;
  } | null = null;
</script>

<div class="user-info">
  <div class="user-avatar">
    {#if user?.avatarUrl}
      <img src={user.avatarUrl} alt={user.username} class="avatar-image" />
    {:else}
      <span class="avatar-letter">
        {user?.username?.charAt(0).toUpperCase() || "U"}
      </span>
    {/if}
  </div>
  <div class="user-details">
    <span class="user-name">{user?.username || t("user")}</span>
    <span class="user-email">{user?.email || ""}</span>
  </div>
</div>
