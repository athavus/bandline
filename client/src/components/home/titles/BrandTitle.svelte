<script lang="ts">
  import { onMount } from "svelte";
  import "./BrandTitle.css";

  let mounted = false;
  export let inline: boolean = false;

  onMount(() => {
    mounted = true;
  });
</script>

<div class="brand-title" class:inline class:mounted>
  <div class="title-container" class:inline>
    <h1 class="title">
      <span class="title-band">Band</span><span class="title-line">line</span>
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
