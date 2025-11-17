<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import "./NavigationButton.css";

    export let direction: "prev" | "next";

    const dispatch = createEventDispatcher();

    function handleClick() {
        dispatch("click");
    }
</script>

<button class="nav-button {direction}" on:click={handleClick} {...$$restProps}>
    {#if direction === "prev"}
        <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
        >
            <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
    {:else}
        <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
        >
            <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
    {/if}
</button>
