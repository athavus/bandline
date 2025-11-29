// lib/urlState.ts
import { writable } from "svelte/store";

// Store para manter o estado sincronizado
export const urlState = writable({
  artistId: null as string | null,
  query: "",
  favoritesSearch: "",
  favoritesSort: null as string | null,
  favoritesView: null as string | null,
  historySearch: "",
  historyView: null as string | null,
});

// Atualiza um parâmetro na URL
export function setQueryParam(key: string, value: string | null) {
  const url = new URL(window.location.href);
  if (value) {
    url.searchParams.set(key, value);
  } else {
    url.searchParams.delete(key);
  }
  window.history.pushState(null, "", url.toString());

  // Atualiza o store
  updateStoreFromURL();
}

// Lê um parâmetro da URL
export function getQueryParam(key: string): string | null {
  const url = new URL(window.location.href);
  return url.searchParams.get(key);
}

// Atualiza múltiplos parâmetros de uma vez
export function setQueryParams(params: Record<string, string | null>) {
  const url = new URL(window.location.href);

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.delete(key);
    }
  });

  window.history.pushState(null, "", url.toString());

  // Atualiza o store
  updateStoreFromURL();
}

// Atualiza o store com base na URL atual
export function updateStoreFromURL() {
  urlState.set({
    artistId: getQueryParam("artist"),
    query: getQueryParam("q") || "",
    favoritesSearch: getQueryParam("favoritesSearch") || "",
    favoritesSort: getQueryParam("favoritesSort"),
    favoritesView: getQueryParam("favoritesView"),
    historySearch: getQueryParam("historySearch") || "",
    historyView: getQueryParam("historyView"),
  });
}

// Inicializa o estado da URL (chamado no onMount do App)
export function initURLState() {
  updateStoreFromURL();

  // Listener para o botão voltar/avançar do navegador
  window.addEventListener("popstate", () => {
    updateStoreFromURL();
    // Dispara um evento customizado para notificar os componentes
    window.dispatchEvent(new CustomEvent("urlstatechange"));
  });
}

// Limpa todos os parâmetros
export function clearURLParams() {
  const url = new URL(window.location.href);
  url.search = "";
  window.history.pushState(null, "", url.toString());
  updateStoreFromURL();
}
