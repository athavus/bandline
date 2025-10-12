<script lang="ts">
  export let track: any;

  function handleTrackClick() {
    window.open(`https://open.spotify.com/track/${track.id}`, '_blank');
  }

  function formatDuration(ms: number) {
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }
</script>

<div 
  class="track-card"
  on:click={handleTrackClick}
  on:keypress={(e) => e.key === 'Enter' && handleTrackClick()}
  role="button"
  tabindex="0"
>
  <div class="track-info">
    <span class="track-num">
      <span class="track-number">{track.track_number}</span>
      <svg class="track-spotify-icon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
      </svg>
    </span>
    <span class="track-title">{track.name}</span>
  </div>
  <span class="track-time">{formatDuration(track.duration_ms)}</span>
</div>

<style>
  .track-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18px 24px;
    background: var(--bg-secondary);
    border-radius: 15px;
    border: 1px solid transparent;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .track-card:hover {
    background: var(--bg-hover);
    border-color: var(--border-color);
    transform: translateX(8px);
  }

  .track-info {
    display: flex;
    align-items: center;
    gap: 20px;
    flex: 1;
    min-width: 0;
  }

  .track-num {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background: var(--bg-hover);
    border: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    color: var(--text-primary);
    font-size: 1rem;
    transition: all 0.3s ease;
    position: relative;
    flex-shrink: 0;
  }

  .track-number {
    position: absolute;
    transition: opacity 0.3s ease;
  }

  .track-spotify-icon {
    position: absolute;
    width: 18px;
    height: 18px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .track-card:hover .track-num {
    background: rgba(30, 215, 96, 0.95);
    color: #000;
    border-color: rgba(30, 215, 96, 0.95);
  }

  .track-card:hover .track-number {
    opacity: 0;
  }

  .track-card:hover .track-spotify-icon {
    opacity: 1;
  }

  .track-title {
    font-weight: 600;
    color: var(--text-primary);
    font-size: 1rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color 0.3s ease;
  }

  .track-time {
    font-family: 'Courier New', monospace;
    color: var(--text-secondary);
    font-weight: 700;
    font-size: 1rem;
    transition: color 0.3s ease;
  }
</style>
