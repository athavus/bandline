<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import ThemeButton from "./utils/ThemeButton.svelte";
    import ThemePaletteButton from "./utils/ThemePaletteButton.svelte";
    import LanguageSelector from "./utils/LanguageSelector.svelte";
    import BrandTitle from "./titles/BrandTitle.svelte";
    import { auth } from "../lib/stores/auth";
    import { t } from "../lib/stores/language";

    export let sidebarOpen = false;
    $: authState = $auth;

    const dispatch = createEventDispatcher();

    function toggleSidebar() {
        sidebarOpen = !sidebarOpen;
    }

    function handleLogout() {
        dispatch("logout");
    }
</script>

<header class="app-header">
    <div class="header-left">
        {#if !sidebarOpen}
            <button
                class="menu-toggle"
                on:click={toggleSidebar}
                aria-label="Toggle menu"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                        d="M3 12H21M3 6H21M3 18H21"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                    />
                </svg>
            </button>
        {/if}
        <ThemeButton />
        <ThemePaletteButton />
    </div>
    <div class="header-center"><BrandTitle inline size="medium" /></div>
    <div class="header-right">
        <LanguageSelector />
        {#if authState.isAuthenticated}
            <div class="user-indicator">
                <span class="user-welcome">
                    {t("hello")}, {authState.user?.username || t("user")}!
                </span>
                <button
                    class="logout-btn"
                    title="logout"
                    on:click={handleLogout}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                        <polyline
                            points="16,17 21,12 16,7"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                        <line
                            x1="21"
                            y1="12"
                            x2="9"
                            y2="12"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </svg>
                </button>
            </div>
        {/if}
    </div>
</header>
<div class="header-spacer"></div>

<style>
    .app-header {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        align-items: center;
        padding: 20px 24px;
        background: var(--bg-secondary);
        border-bottom: 1px solid var(--border-color);
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 100;
        min-height: 70px;
        box-sizing: border-box;
    }
    .header-spacer {
        height: 70px;
    }
    .header-left {
        display: flex;
        align-items: center;
        gap: 16px;
        min-width: 0;
        justify-self: start;
        margin: 0;
        padding: 0;
    }
    .header-center {
        display: flex;
        align-items: center;
        justify-content: center;
        justify-self: center;
        width: 100%;
        margin: 0;
        padding: 0;
    }
    .header-right {
        display: flex;
        align-items: center;
        gap: 16px;
        min-width: 0;
        justify-self: end;
        flex-shrink: 0;
        margin: 0;
        padding: 0;
    }
    .menu-toggle {
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        color: var(--text-primary);
        box-shadow: var(--shadow-sm);
        margin: 0;
        padding: 0;
        flex-shrink: 0;
    }
    .menu-toggle:hover {
        background: var(--bg-hover);
        border-color: var(--accent-color);
        transform: scale(1.05);
    }
    .user-indicator {
        display: flex;
        align-items: center;
        gap: 12px;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 8px 16px;
        box-shadow: var(--shadow-sm);
    }
    .user-welcome {
        color: var(--text-primary);
        font-family: var(--font-primary);
        font-size: 0.9rem;
        font-weight: 500;
        margin-right: 8px;
    }
    .logout-btn {
        background: none;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
    }
    .logout-btn:hover {
        color: var(--error-color);
        background: var(--bg-hover);
        transform: scale(1.1);
    }
    /* Tablet */
    @media (max-width: 1024px) and (min-width: 769px) {
        .app-header {
            padding: 14px 18px;
            min-height: 66px;
            grid-template-columns: max-content 1fr max-content;
            gap: 10px;
            align-items: center;
        }
        .header-spacer {
            height: 66px;
        }
        .header-left {
            gap: 10px;
            flex-shrink: 0;
            margin: 0;
            padding: 0;
        }
        .header-right {
            gap: 10px;
            flex-shrink: 0;
            justify-self: end;
            align-items: center;
            margin: 0;
            padding: 0;
        }
        .menu-toggle {
            width: 38px;
            height: 38px;
            margin: 0;
            padding: 0;
        }
        .user-indicator {
            padding: 7px 12px;
            margin: 0;
        }
        .user-welcome {
            font-size: 0.8rem;
            margin-right: 8px;
        }
        .header-center {
            flex: 1;
            min-width: 0;
            justify-content: center;
            overflow: hidden;
            padding: 0;
            margin: 0;
        }
        .header-center :global(.brand-title) {
            padding: 0 !important;
            margin: 0 !important;
            width: 100%;
        }
        .header-center :global(.title-container) {
            justify-content: center !important;
            margin: 0;
            padding: 0;
        }
        .header-center :global(.title) {
            font-size: 0.9rem !important;
            margin: 0 !important;
            padding: 0;
        }
        .header-center :global(.title-band),
        .header-center :global(.title-line) {
            font-size: 0.9rem !important;
        }
        .header-left :global(button),
        .header-right :global(button),
        .header-right :global(.language-button) {
            width: 38px;
            height: 38px;
            padding: 0;
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }

    @media (max-width: 768px) {
        .app-header {
            padding: 12px 16px;
            min-height: 64px;
            grid-template-columns: max-content 1fr max-content;
            gap: 12px;
            align-items: center;
        }
        .header-spacer {
            height: 64px;
        }
        .header-left {
            gap: 8px;
            flex-shrink: 0;
            margin: 0;
            padding: 0;
        }
        .header-right {
            gap: 8px;
            flex-shrink: 0;
            justify-self: end;
            align-items: center;
            margin: 0;
            padding: 0;
        }
        .menu-toggle {
            width: 36px;
            height: 36px;
            margin: 0;
            padding: 0;
        }
        .user-indicator {
            padding: 6px 10px;
            margin: 0;
        }
        .user-welcome {
            font-size: 0.75rem;
            margin-right: 6px;
        }
        .header-center {
            flex: 1;
            min-width: 0;
            justify-content: center;
            overflow: hidden;
            padding: 0;
            margin: 0;
        }
        .header-center :global(.brand-title) {
            padding: 0 !important;
            margin: 0 !important;
            width: 100%;
        }
        .header-center :global(.title-container) {
            justify-content: center !important;
            margin: 0;
            padding: 0;
        }
        .header-center :global(.title) {
            font-size: 0.85rem !important;
            margin: 0 !important;
            padding: 0;
        }
        .header-center :global(.title-band),
        .header-center :global(.title-line) {
            font-size: 0.85rem !important;
        }
        .header-left :global(button),
        .header-right :global(button),
        .header-right :global(.language-button) {
            width: 36px;
            height: 36px;
            padding: 0;
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }

    @media (max-width: 480px) {
        .app-header {
            padding: 10px 12px;
            min-height: 60px;
            grid-template-columns: max-content 1fr max-content;
            gap: 6px;
            align-items: center;
        }
        .header-spacer {
            height: 60px;
        }
        .header-left {
            gap: 6px;
            flex-shrink: 0;
            margin: 0;
            padding: 0;
        }
        .header-right {
            gap: 6px;
            flex-shrink: 0;
            justify-self: end;
            align-items: center;
            margin: 0;
            padding: 0;
        }
        .user-welcome {
            display: none;
        }
        .menu-toggle {
            width: 32px;
            height: 32px;
            margin: 0;
            padding: 0;
        }
        .user-indicator {
            padding: 6px 8px;
            min-width: auto;
            margin: 0;
        }
        .logout-btn {
            padding: 4px;
            margin: 0;
        }
        .header-center {
            padding: 0;
            margin: 0;
            overflow: hidden;
            flex: 1;
            min-width: 0;
            justify-content: center;
        }
        .header-center :global(.brand-title) {
            padding: 0 !important;
            margin: 0 !important;
            width: 100%;
        }
        .header-center :global(.title-container) {
            justify-content: center !important;
            margin: 0;
            padding: 0;
        }
        .header-center :global(.title) {
            font-size: 0.7rem !important;
            margin: 0 !important;
            padding: 0;
        }
        .header-center :global(.title-band),
        .header-center :global(.title-line) {
            font-size: 0.7rem !important;
        }
        .header-center :global(.music-wave) {
            display: none !important;
        }
        .header-left :global(button),
        .header-right :global(button),
        .header-right :global(.language-button) {
            width: 32px;
            height: 32px;
            padding: 0;
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .header-right :global(.language-button) {
            padding: 0;
            margin: 0;
        }
        .header-right :global(.flag) {
            font-size: 0.9rem;
        }
        .header-right :global(.dropdown-arrow) {
            display: none;
        }
    }
</style>
