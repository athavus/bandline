import { writable, derived } from "svelte/store";
import { tick } from "svelte";

export interface Route {
  path: string;
  component: any;
}

export interface Location {
  path: string;
  params: Record<string, string>;
  query: Record<string, string>;
}

function parseLocation(): Location {
  const path = window.location.pathname;
  const searchParams = new URLSearchParams(window.location.search);
  const query: Record<string, string> = {};

  searchParams.forEach((value, key) => {
    query[key] = value;
  });

  return {
    path,
    params: {},
    query,
  };
}

// Store para a localização atual - inicializa imediatamente com a URL atual
const initialLocation =
  typeof window !== "undefined"
    ? parseLocation()
    : { path: "/", params: {}, query: {} };
const { subscribe, set, update } = writable<Location>(initialLocation);

let initialized = false;

export function init() {
  if (initialized) return;
  initialized = true;

  // Atualiza com a localização atual
  const currentLocation = parseLocation();
  set(currentLocation);

  // Listener para mudanças de rota (botão voltar/avançar)
  window.addEventListener("popstate", () => {
    set(parseLocation());
  });
}

// Inicializa automaticamente se estiver no browser
if (typeof window !== "undefined") {
  init();
}

export const location = {
  subscribe,
  init,
  updateLocation: () => set(parseLocation()),
};

// Função para navegar para uma nova rota
export async function push(path: string) {
  if (!path || path.length < 1 || path.charAt(0) !== "/") {
    throw Error("Invalid path: must start with /");
  }

  await tick();
  window.history.pushState(null, "", path);
  location.updateLocation();
}

// Função para substituir a rota atual
export async function replace(path: string) {
  if (!path || path.length < 1 || path.charAt(0) !== "/") {
    throw Error("Invalid path: must start with /");
  }

  await tick();
  window.history.replaceState(null, "", path);
  location.updateLocation();
}

// Função para voltar no histórico
export async function pop() {
  await tick();
  window.history.back();
}

// Store derivado para o path atual
export const path = derived(location, ($location) => $location.path);

// Store derivado para os query params
export const query = derived(location, ($location) => $location.query);
