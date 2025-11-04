<script lang="ts">
  import {
    language,
    setLanguage,
    type Language,
  } from "../../../lib/stores/language";
  import "./LanguageSelector.css";

  let isOpen = false;
  const languages = [
    { code: "en" as Language, flag: "🇺🇸" },
    { code: "pt" as Language, flag: "🇧🇷" },
    { code: "es" as Language, flag: "🇪🇸" },
  ];

  function handleLanguageChange(lang: Language) {
    setLanguage(lang);
    isOpen = false;
    window.location.reload();
  }

  function toggleDropdown() {
    isOpen = !isOpen;
  }

  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest(".language-selector")) {
      isOpen = false;
    }
  }

  $: currentLang = $language;
  $: currentLanguageData =
    languages.find((lang) => lang.code === currentLang) || languages[0];
</script>

<svelte:window on:click={handleClickOutside} />

<div class="language-selector">
  <button
    class="language-button"
    on:click={toggleDropdown}
    aria-label="Select language"
    aria-expanded={isOpen}
  >
    <span class="flag">{currentLanguageData.flag}</span>
    <svg
      class="dropdown-arrow"
      class:open={isOpen}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M6 9L12 15L18 9"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </button>

  {#if isOpen}
    <div class="language-dropdown">
      {#each languages as lang}
        <button
          class="language-option"
          class:active={lang.code === currentLang}
          on:click={() => handleLanguageChange(lang.code)}
        >
          <span class="flag">{lang.flag}</span>
        </button>
      {/each}
    </div>
  {/if}
</div>
