<script lang="ts">
  import { onMount } from "svelte";
  import "./BrandSubtitle.css";

  let mounted = false;
  export let firstWord: string = "Band";
  export let secondWord: string = "line";
  export let inline: boolean = false;

  onMount(() => {
    mounted = true;
  });
</script>

<div class="brand-subtitle" class:inline class:mounted>
  <div class="subtitle-container" class:inline>
    <h2 class="subtitle">
      <span class="subtitle-first">{firstWord}</span><span
        class="subtitle-second">{secondWord}</span
      >
    </h2>
  </div>
</div>
