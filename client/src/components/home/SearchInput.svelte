<script lang="ts">
    import { createEventDispatcher } from "svelte";

    export let value = "";
    export let placeholder = "Digite o nome do artista";

    const dispatch = createEventDispatcher();

    function handleInput() {
        dispatch("input", value);
    }

    function handleFocus() {
        dispatch("focus");
    }

    function handleBlur() {
        dispatch("blur");
    }
</script>

<input
    bind:value
    on:input={handleInput}
    on:focus={handleFocus}
    on:blur={handleBlur}
    type="text"
    {placeholder}
    id="search-input"
    class="search-input"
/>

<style>
    .search-input {
        width: 100%;
        max-width: 500px;
        padding: 16px 20px;
        font-family: var(--font-primary);
        font-size: 16px;
        font-weight: 500;
        border: 2px solid var(--border-color);
        border-radius: 8px;
        background: var(--bg-input);
        color: var(--text-primary);
        transition: all 0.3s ease;
        box-shadow: var(--shadow-sm);
        outline: none;
    }

    .search-input::placeholder {
        opacity: 1;
        font-weight: 400;
    }

    .search-input:focus {
        border-color: var(--accent-color);
        box-shadow:
            0 0 0 4px rgba(29, 185, 84, 0.1),
            var(--shadow-md);
        transform: translateY(-1px);
    }

    .search-input:hover {
        border-color: var(--accent-color);
        box-shadow: var(--shadow-md);
    }

    .search-input:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        background: var(--bg-secondary);
    }

    .search-input:disabled:hover {
        border-color: var(--border-color);
        box-shadow: var(--shadow-sm);
        transform: none;
    }

    @media (max-width: 768px) {
        .search-input {
            padding: 14px 16px;
            font-size: 16px; /* Prevents zoom on iOS */
            border-radius: 8px;
        }
    }
</style>
