<script lang="ts">
  import { t } from "../../../lib/stores/language";
  import "./AuthPrompt.css";
</script>

<div class="auth-prompt">
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
    <path
      d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
      stroke="currentColor"
      stroke-width="2"
    />
    <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" />
  </svg>
  <h3>{t("welcome")}</h3>
  <p>{t("signInToAccess")}</p>
</div>
