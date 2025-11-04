<script lang="ts">
  import "./LoadingSpinner.css";

  export let text: string;
  export let small: boolean = false;
</script>

<div class="loading">
  <div class="spinner-container">
    <div class="loading-spinner {small ? 'small' : ''}"></div>
    <div class="spinner-ring {small ? 'small' : ''}"></div>
  </div>
  <p>{text}</p>
</div>
