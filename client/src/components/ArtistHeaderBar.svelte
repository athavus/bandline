<script lang="ts">
  export let name: string = '';
  export let onDetailsClick: () => void;
</script>

<div class="artist-header-bar">
  <div class="artist-header-container">
    <h2 class="artist-name">{name}</h2>
    <button class="details-btn-compact" on:click={onDetailsClick}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <polyline points="13 2 13 9 20 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      Detalhes do Artista
    </button>
  </div>
</div>

<style>
  .artist-header-bar {
    background: var(--bg-primary);
    padding: 24px 24px 0 24px;
    margin: 0;
  }

  .artist-header-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
    padding-bottom: 20px;
    border-bottom: 2px solid transparent;
    border-image: linear-gradient(90deg, transparent 0%, var(--accent-color) 50%, transparent 100%) 1;
    border-width: 0 0 2px 0;
    border-style: solid;
  }

  .artist-name {
    margin: 0;
    color: var(--text-primary);
    font-family: var(--font-heading);
    font-size: 1.6rem;
    font-weight: 700;
    background: linear-gradient(135deg, var(--text-primary) 0%, var(--accent-color) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .details-btn-compact {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 12px 24px;
    background: linear-gradient(135deg, #1db954 0%, #1ed760 100%);
    border: none;
    border-radius: 24px;
    color: white;
    cursor: pointer;
    font-family: var(--font-primary);
    font-size: 0.9rem;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(29, 185, 84, 0.3);
    white-space: nowrap;
    position: relative;
    overflow: hidden;
  }

  .details-btn-compact::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s ease;
  }

  .details-btn-compact:hover::before { left: 100%; }

  .details-btn-compact:hover {
    background: linear-gradient(135deg, #1ed760 0%, #1db954 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(29, 185, 84, 0.4);
  }

  .details-btn-compact:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(29, 185, 84, 0.3);
  }

  @media (max-width: 768px) {
    .artist-header-bar { padding: 20px 0 0 20px; }
    .artist-header-container { gap: 14px; padding-bottom: 16px; }
    .artist-name { font-size: 1.4rem; }
    .details-btn-compact { padding: 10px 20px; font-size: 0.85rem; gap: 8px; }
  }

  @media (max-width: 480px) {
    .artist-header-bar { padding: 16px 0 0 16px; }
    .artist-header-container { flex-direction: column; align-items: flex-start; gap: 14px; padding-bottom: 14px; }
    .artist-name { font-size: 1.3rem; }
    .details-btn-compact { padding: 10px 20px; font-size: 0.85rem; }
  }
</style>


