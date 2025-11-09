<script lang="ts">
  import "./Loading.css";

  export let message = "Carregando...";
</script>

<div class="loading">
  <div class="spinner-container">
    <div class="spinner"></div>
    <div class="spinner-ring"></div>
  </div>
  <p>{message}</p>
</div>
