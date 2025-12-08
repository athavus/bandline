<script lang="ts">
    import { onMount } from "svelte";

    let isDarkMode = false;

    onMount(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            isDarkMode = savedTheme === "dark";
        } else {
            isDarkMode = window.matchMedia(
                "(prefers-color-scheme: dark)",
            ).matches;
        }
        applyTheme();
    });

    function toggleTheme() {
        isDarkMode = !isDarkMode;
        localStorage.setItem("theme", isDarkMode ? "dark" : "light");
        applyTheme();
    }

    function applyTheme() {
        if (isDarkMode) {
            document.documentElement.classList.add("dark-theme");
            document.documentElement.classList.remove("light-theme");
        } else {
            document.documentElement.classList.add("light-theme");
            document.documentElement.classList.remove("dark-theme");
        }
    }
</script>

<button
    class="theme-toggle"
    on:click={toggleTheme}
    title={isDarkMode ? "Mudar para tema claro" : "Mudar para tema escuro"}
>
    <span class="icon">
        {#if isDarkMode}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
        {:else}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                ></path>
            </svg>
        {/if}
    </span>
</button>

<style>
    .theme-toggle {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        border: 1px solid var(--theme-toggle-border);
        background: var(--theme-toggle-bg);
        color: var(--theme-toggle-color);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        box-shadow: var(--theme-toggle-shadow);
    }

    .theme-toggle:hover {
        transform: scale(1.05);
        box-shadow: var(--theme-toggle-shadow-hover);
        border-color: var(--accent-color);
    }

    .theme-toggle:active {
        transform: scale(0.95);
    }

    .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.3s ease;
    }

    .theme-toggle:hover .icon {
        transform: rotate(15deg);
    }

    .icon svg {
        width: 20px;
        height: 20px;
    }

    @media (max-width: 768px) {
        .theme-toggle {
            width: 36px;
            height: 36px;
        }
        .icon svg {
            width: 18px;
            height: 18px;
        }
    }

    @media (max-width: 480px) {
        .theme-toggle {
            width: 32px;
            height: 32px;
        }
        .icon svg {
            width: 16px;
            height: 16px;
        }
    }
</style>
