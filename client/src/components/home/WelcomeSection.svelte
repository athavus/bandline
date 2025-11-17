<script lang="ts">
    import { t } from "../../lib/stores/language";
    import "./WelcomeSection.css";

    export let onLogin: () => void;
    export let onRegister: () => void;
</script>

<div class="welcome-section">
    <h2>{t("welcomeSubtitle")}</h2>
    <p>{t("welcomeDescription")}</p>
    <div class="welcome-buttons">
        <button class="primary-btn" on:click={onLogin}>{t("login")}</button>
        <button class="secondary-btn" on:click={onRegister}
            >{t("register")}</button
        >
    </div>
</div>
