<script lang="ts">
    import { onMount } from "svelte";

    type Palette = { accent: string; hover: string; dark: string };

    const palettes: Palette[] = [
        { accent: "#1db954", hover: "#1ed760", dark: "#0d8040" },
        { accent: "#ef4444", hover: "#f87171", dark: "#b91c1c" },
        { accent: "#7c3aed", hover: "#8b5cf6", dark: "#5b21b6" },
        { accent: "#ef44cc", hover: "#f472b6", dark: "#9d174d" },
        { accent: "#38bdf8", hover: "#60a5fa", dark: "#0369a1" },
        { accent: "#1e40af", hover: "#2563eb", dark: "#1e3a8a" },
        { accent: "#f97316", hover: "#fb923c", dark: "#c2410c" },
        { accent: "#eab308", hover: "#facc15", dark: "#a16207" },
        { accent: "#6b7280", hover: "#9ca3af", dark: "#374151" },
    ];

    let open = false;
    let currentAccent = "#1db954";

    onMount(() => {
        const saved = localStorage.getItem("accentPalette");
        if (saved) {
            try {
                const { accent, hover, dark } = JSON.parse(saved);
                applyPalette(accent, hover, dark);
                currentAccent = accent;
            } catch {}
        } else {
            currentAccent =
                getComputedStyle(document.documentElement)
                    .getPropertyValue("--accent-color")
                    .trim() || "#1db954";
        }
    });

    function applyPalette(accent: string, hover: string, dark: string) {
        const root = document.documentElement;
        root.style.setProperty("--accent-color", accent);
        root.style.setProperty("--accent-hover", hover);
        root.style.setProperty("--accent-dark", dark);

        // keep rgb in sync for effects
        const { r, g, b } = hexToRgb(accent);
        root.style.setProperty("--accent-rgb", `${r}, ${g}, ${b}`);
        root.style.setProperty(
            "--gradient-primary",
            `linear-gradient(135deg, ${accent} 0%, ${hover} 100%)`,
        );

        localStorage.setItem(
            "accentPalette",
            JSON.stringify({ accent, hover, dark }),
        );
    }

    function hexToRgb(hex: string) {
        const str = hex.replace("#", "");
        const bigint = parseInt(
            str.length === 3
                ? str
                      .split("")
                      .map((h) => h + h)
                      .join("")
                : str,
            16,
        );
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return { r, g, b };
    }

    function selectPalette(p: Palette) {
        applyPalette(p.accent, p.hover, p.dark);
        currentAccent = p.accent;
        open = false;
    }
</script>

<div class="palette-wrapper">
    <button
        class="palette-toggle"
        on:click={() => (open = !open)}
        aria-haspopup="true"
        aria-expanded={open}
        title="Mudar cor do tema"
    >
        <span class="swatch" style={`background: ${currentAccent}`}></span>
    </button>
    {#if open}
        <div class="palette-popover" role="menu">
            {#each palettes as p}
                <button
                    class="palette-option"
                    role="menuitem"
                    on:click={() => selectPalette(p)}
                    title="palette"
                >
                    <span class="swatch" style={`background: ${p.accent}`}
                    ></span>
                </button>
            {/each}
        </div>
    {/if}
    <div
        class="backdrop"
        class:show={open}
        role="presentation"
        aria-hidden="true"
        on:click={() => (open = false)}
    ></div>
</div>

<style>
    .palette-wrapper {
        position: relative;
    }

    .palette-toggle {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        border: 1px solid var(--theme-toggle-border);
        background: var(--theme-toggle-bg);
        color: var(--theme-toggle-color);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        box-shadow: var(--theme-toggle-shadow);
    }

    .palette-toggle:hover {
        transform: scale(1.05);
        box-shadow: var(--theme-toggle-shadow-hover);
        border-color: var(--accent-color);
    }
    .palette-toggle:active {
        transform: scale(0.95);
    }

    .swatch {
        width: 20px;
        height: 20px;
        border-radius: 4px;
        box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.1);
    }

    .palette-popover {
        position: absolute;
        top: calc(100% + 8px);
        left: 0;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 10px;
        padding: 8px;
        display: grid;
        grid-auto-flow: column; /* Extende as opções na horizontal */
        gap: 6px;
        box-shadow: var(--shadow-lg);
        z-index: 20;
        max-width: max-content; /* Ajusta a largura para o conteúdo */
    }

    .palette-option {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 8px;
        background: var(--bg-primary);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
        width: 40px;
        height: 40px;
    }

    .palette-option:hover {
        border-color: var(--accent-color);
        background: var(--bg-hover);
        transform: translateY(-1px);
    }

    .label {
        white-space: nowrap;
    }

    .backdrop {
        position: fixed;
        inset: 0;
        display: none;
    }
    .backdrop.show {
        display: block;
    }
</style>
