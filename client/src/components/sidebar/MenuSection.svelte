<script lang="ts">
  export let title: string | null = null;
  import "./MenuSection.css";
</script>

<div class="sidebar-section">
  {#if title}
    <h3>{title}</h3>
  {/if}
  <nav class="sidebar-menu">
    <slot />
  </nav>
</div>
