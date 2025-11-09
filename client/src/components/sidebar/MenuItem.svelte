<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import "./MenuItem.css";

  export let icon: string;
  export let label: string;
  export let variant: "default" | "primary" | "secondary" | "danger" =
    "default";
  export let disabled = false;

  const dispatch = createEventDispatcher();

  function handleClick() {
    if (!disabled) {
      dispatch("click");
    }
  }
</script>

<button
  class="menu-item"
  class:primary={variant === "primary"}
  class:secondary={variant === "secondary"}
  class:danger={variant === "danger"}
  class:disabled
  on:click={handleClick}
>
  {@html icon}
  {label}
</button>
