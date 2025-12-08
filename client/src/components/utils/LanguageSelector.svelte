<script lang="ts">
    import {
        language,
        setLanguage,
        type Language,
    } from "../../lib/stores/language";

    let isOpen = false;
    const languages = [
        { code: "en" as Language, flag: "🇺🇸" },
        { code: "pt" as Language, flag: "🇧🇷" },
        { code: "es" as Language, flag: "🇪🇸" },
    ];

    function handleLanguageChange(lang: Language) {
        setLanguage(lang);
        isOpen = false;
        window.location.reload();
    }

    function toggleDropdown() {
        isOpen = !isOpen;
    }

    function handleClickOutside(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!target.closest(".language-selector")) {
            isOpen = false;
        }
    }

    $: currentLang = $language;
    $: currentLanguageData =
        languages.find((lang) => lang.code === currentLang) || languages[0];
</script>

<svelte:window on:click={handleClickOutside} />

<div class="language-selector">
    <button
        class="language-button"
        on:click={toggleDropdown}
        aria-label="Select language"
        aria-expanded={isOpen}
    >
        <span class="flag">{currentLanguageData.flag}</span>
        <svg
            class="dropdown-arrow"
            class:open={isOpen}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
        >
            <path
                d="M6 9L12 15L18 9"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>
    </button>

    {#if isOpen}
        <div class="language-dropdown">
            {#each languages as lang}
                <button
                    class="language-option"
                    class:active={lang.code === currentLang}
                    on:click={() => handleLanguageChange(lang.code)}
                >
                    <span class="flag">{lang.flag}</span>
                </button>
            {/each}
        </div>
    {/if}
</div>

<style>
    .language-selector {
        position: relative;
        display: inline-block;
    }

    .language-button {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        color: var(--text-primary);
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.9rem;
        font-weight: 500;
        box-shadow: var(--shadow-sm);
    }

    .language-button:hover {
        background: var(--bg-hover);
        border-color: var(--accent-color);
        transform: translateY(-1px);
        box-shadow: var(--shadow-md);
    }

    .flag {
        font-size: 1.1rem;
        line-height: 1;
    }

    .dropdown-arrow {
        transition: transform 0.3s ease;
        color: var(--text-secondary);
    }

    .dropdown-arrow.open {
        transform: rotate(180deg);
    }

    .language-dropdown {
        position: absolute;
        top: 100%;
        margin-top: 4px;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        min-width: 50px;
        overflow: hidden;
        animation: slideDown 0.2s ease;
    }

    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-8px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .language-option {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        width: 100%;
        padding: 12px 16px;
        background: transparent;
        border: none;
        color: var(--text-primary);
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 0.9rem;
        font-weight: 500;
        text-align: left;
    }

    .language-option:hover {
        background: var(--bg-hover);
    }

    .language-option.active {
        background: var(--accent-color);
        color: white;
    }

    .language-option.active .flag {
        filter: none;
    }

    .language-option:not(.active) .flag {
        filter: grayscale(0.2);
    }

    @media (max-width: 768px) {
        .language-button {
            padding: 6px 10px;
            font-size: 0.85rem;
        }

        .language-dropdown {
            min-width: 50px;
        }

        .language-option {
            padding: 10px 12px;
            font-size: 0.85rem;
        }
    }

    @media (max-width: 480px) {
        .language-button {
            padding: 0;
            width: 32px;
            height: 32px;
            min-width: 32px;
            justify-content: center;
        }

        .flag {
            font-size: 1rem;
        }

        .dropdown-arrow {
            display: none;
        }
    }
</style>
