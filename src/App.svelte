<script lang="ts">
  let count: number = 0;

  function aumentarContador() {
    count++;
  }
</script>

<main>
  <button class="buttons" on:click={aumentarContador}>
    O número no contador é {count}
  </button>
</main>

<style>
  .buttons {
    border: none;
    outline: none;
  }
</style>
