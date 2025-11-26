<script lang="ts">
    import { t } from "../../lib/stores/language";
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

<style>
    .auth-prompt {
        text-align: center;
        padding: 20px 16px;
    }

    .auth-prompt svg {
        color: var(--text-secondary);
        margin-bottom: 16px;
    }

    .auth-prompt h3 {
        color: var(--text-primary);
        font-size: 1.2rem;
        font-weight: 600;
        margin: 0 0 8px 0;
        text-transform: none;
        letter-spacing: normal;
    }

    .auth-prompt p {
        color: var(--text-secondary);
        font-size: 0.9rem;
        line-height: 1.4;
        margin: 0;
    }
</style>
