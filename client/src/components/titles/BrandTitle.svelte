<script lang="ts">
    import { onMount } from "svelte";

    let mounted = false;
    export let inline: boolean = false;
    export let size: "small" | "medium" | "large" = "medium";

    onMount(() => {
        mounted = true;
    });
</script>

<div
    class="brand-title"
    class:inline
    class:mounted
    class:small={size === "small"}
    class:medium={size === "medium"}
    class:large={size === "large"}
>
    <div class="title-container" class:inline>
        <h1 class="title">
            <span class="title-band">Band</span><span class="title-line"
                >line</span
            >
        </h1>
        <div class="music-wave">
            <span class="wave-bar"></span>
            <span class="wave-bar"></span>
            <span class="wave-bar"></span>
            <span class="wave-bar"></span>
            <span class="wave-bar"></span>
        </div>
    </div>
    <div class="gradient-bg"></div>
</div>

<style>
    .brand-title {
        position: relative;
        width: 100%;
        padding: 60px 0 40px;
        text-align: center;
        overflow: hidden;
    }

    .brand-title .music-wave {
        margin-top: 10px; /* Centralizado, abaixo do título */
        margin-left: 0;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        gap: 4px;
        height: 24px;
        opacity: 0;
        animation: fadeIn 0.8s ease-out 0.6s forwards;
    }

    .gradient-bg {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 150%;
        height: 100%;
        background: radial-gradient(
            ellipse at center,
            rgba(var(--accent-rgb), 0.15) 0%,
            rgba(var(--accent-rgb), 0.05) 40%,
            transparent 70%
        );
        pointer-events: none;
        animation: pulse 4s ease-in-out infinite;
    }

    @keyframes pulse {
        0%,
        100% {
            opacity: 1;
            transform: translateX(-50%) scale(1);
        }
        50% {
            opacity: 0.8;
            transform: translateX(-50%) scale(1.1);
        }
    }

    .title-container {
        display: block;
        text-align: center;
        justify-content: center;
        align-items: center;
    }

    .title-container.inline {
        display: flex !important;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        text-align: left;
    }

    .brand-title.inline {
        background: none !important;
        box-shadow: none !important;
        padding: 0 8px !important;
        min-width: 0;
    }

    .brand-title.inline .title-container {
        display: flex !important;
        align-items: center;
        justify-content: flex-start;
        opacity: 1;
        transform: none;
        text-align: left;
    }

    .brand-title.inline .title {
        font-size: 1.25rem !important;
        margin: 0 !important;
        line-height: 1.05;
    }

    .brand-title.inline .title-band,
    .brand-title.inline .title-line {
        font-size: 1.25rem !important;
        font-weight: 900 !important;
        text-shadow: none;
    }

    .brand-title.inline .music-wave {
        height: 14px;
        gap: 2px;
        margin-left: 8px !important;
        margin-top: 0 !important;
        opacity: 1;
        animation: none;
        top: -2px;
        position: relative;
    }

    .brand-title.inline .wave-bar {
        width: 2px;
        border-radius: 1.5px;
    }

    .brand-title.inline .wave-bar:nth-child(1) {
        height: 5px;
    }

    .brand-title.inline .wave-bar:nth-child(2) {
        height: 9px;
    }

    .brand-title.inline .wave-bar:nth-child(3) {
        height: 12px;
    }

    .brand-title.inline .wave-bar:nth-child(4) {
        height: 7px;
    }

    .brand-title.inline .wave-bar:nth-child(5) {
        height: 5px;
    }

    /* Remove linha animada do "line" para não entortar */
    .brand-title.inline .title-line::after {
        display: none !important;
    }

    .brand-title.medium .music-wave {
        gap: 4px;
        margin-left: 18px !important;
        margin-top: 0 !important;
        opacity: 1;
        animation: none;
        top: 1px;
        position: relative;
    }

    .brand-title.medium .wave-bar {
        width: 2px;
    }

    .brand-title.medium .wave-bar:nth-child(1) {
        height: 8px; /* maior que o pequeno */
    }

    .brand-title.medium .wave-bar:nth-child(2) {
        height: 14px;
    }

    .brand-title.medium .wave-bar:nth-child(3) {
        height: 18px;
    }

    .brand-title.medium .wave-bar:nth-child(4) {
        height: 14px;
    }

    .brand-title.medium .wave-bar:nth-child(5) {
        height: 8px;
    }

    /* Tamanhos small, medium e large para o título e seus elementos */
    .brand-title.small .title {
        font-size: 1.25rem !important;
    }
    .brand-title.medium .title {
        font-size: 2.5rem !important;
    }
    .brand-title.large .title {
        font-size: 4.5rem !important;
    }

    .brand-title.small .title-band,
    .brand-title.small .title-line {
        font-size: 1.25rem !important;
        font-weight: 900 !important;
    }

    .brand-title.medium .title-band,
    .brand-title.medium .title-line {
        font-size: 2.5rem !important;
        font-weight: 900 !important;
    }

    .brand-title.large .title-band,
    .brand-title.large .title-line {
        font-size: 4.5rem !important;
        font-weight: 900 !important;
    }

    .title {
        margin: 0 0 16px 0;
        font-family: var(--font-heading);
        font-weight: 900;
        line-height: 1;
        letter-spacing: -0.02em;
        display: inline-block;
        position: relative;
    }

    .title-band {
        background: linear-gradient(
            135deg,
            var(--accent-color) 0%,
            var(--accent-hover) 50%,
            var(--accent-color) 100%
        );
        background-size: 200% 200%;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: gradientShift 3s ease infinite;
        text-shadow: 0 0 40px rgba(var(--accent-rgb), 0.3);
    }

    .title-line {
        color: var(--text-primary);
        position: relative;
    }

    .title-line::after {
        content: "";
        position: absolute;
        bottom: 8px;
        left: 0;
        width: 100%;
        height: 4px;
        background: linear-gradient(
            90deg,
            var(--accent-color),
            var(--accent-hover)
        );
        border-radius: 2px;
        animation: expandLine 1s ease-out 0.3s forwards;
        transform-origin: left;
        transform: scaleX(0);
    }

    @keyframes gradientShift {
        0%,
        100% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
    }

    @keyframes expandLine {
        to {
            transform: scaleX(1);
        }
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .wave-bar {
        background: linear-gradient(
            180deg,
            var(--accent-color),
            var(--accent-hover)
        );
        border-radius: 2px;
        animation: wave 1.2s ease-in-out infinite;
    }

    /* Default wave bar width and animated heights */
    .wave-bar {
        width: 3px;
        animation-delay: initial;
    }

    .wave-bar:nth-child(1) {
        height: 8px;
        animation-delay: 0s;
    }

    .wave-bar:nth-child(2) {
        height: 16px;
        animation-delay: 0.1s;
    }

    .wave-bar:nth-child(3) {
        height: 20px;
        animation-delay: 0.2s;
    }

    .wave-bar:nth-child(4) {
        height: 14px;
        animation-delay: 0.3s;
    }

    .wave-bar:nth-child(5) {
        height: 10px;
        animation-delay: 0.4s;
    }

    @keyframes wave {
        0%,
        100% {
            transform: scaleY(1);
        }
        50% {
            transform: scaleY(1.5);
        }
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
        .brand-title {
            padding: 50px 20px 30px;
        }

        .title {
            font-size: 3.5rem;
        }

        .music-wave {
            height: 20px;
            margin-top: 12px;
            gap: 4px;
        }
    }

    @media (max-width: 480px) {
        .brand-title {
            padding: 40px 16px 24px;
        }

        .title {
            font-size: 2.8rem;
        }

        .title-line::after {
            height: 3px;
            bottom: 6px;
        }

        .music-wave {
            height: 18px;
            margin-top: 10px;
            gap: 3px;
        }

        .wave-bar {
            width: 2.5px;
        }

        .wave-bar:nth-child(1) {
            height: 6px;
        }

        .wave-bar:nth-child(2) {
            height: 12px;
        }

        .wave-bar:nth-child(3) {
            height: 16px;
        }

        .wave-bar:nth-child(4) {
            height: 11px;
        }

        .wave-bar:nth-child(5) {
            height: 8px;
        }
    }
</style>
