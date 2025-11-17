<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import "./SearchInput.css";

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
