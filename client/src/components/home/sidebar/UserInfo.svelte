<script lang="ts">
  import { t } from "../../../lib/stores/language";

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

<style>
  .user-info {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    background: var(--bg-primary);
    border-radius: 12px;
    border: 1px solid var(--border-color);
  }

  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--gradient-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
    font-size: 1.1rem;
    overflow: hidden;
    flex-shrink: 0;
  }

  .avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }

  .avatar-letter {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .user-details {
    flex: 1;
    min-width: 0;
  }

  .user-name {
    display: block;
    color: var(--text-primary);
    font-weight: 500;
    font-size: 0.95rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .user-email {
    display: block;
    color: var(--text-secondary);
    font-size: 0.8rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
