import { writable } from 'svelte/store';

const createAuthStore = () => {
  const { subscribe, set, update } = writable({
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null
  });

  const API = import.meta.env.VITE_API_URL;    // ex: http://localhost:3000

  return {
    subscribe,

    login: async (username, password) => {
      update(state => ({ ...state, loading: true, error: null }));
      try {
        const response = await fetch(`${API}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
          credentials: 'include'
        });
        const data = await response.json();
        if (response.ok) {
          set({ user: data.user, isAuthenticated: true, loading: false, error: null });
          return { success: true };
        } else {
          update(state => ({ ...state, loading: false, error: data.error || 'Erro no login' }));
          return { success: false, error: data.error };
        }
      } catch {
        update(state => ({ ...state, loading: false, error: 'Erro de conexão' }));
        return { success: false, error: 'Erro de conexão' };
      }
    },

    register: async (username, email, password) => {
      update(state => ({ ...state, loading: true, error: null }));
      try {
        const response = await fetch(`${API}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password }),
          credentials: 'include'
        });
        const data = await response.json();
        if (response.ok) {
          update(state => ({ ...state, loading: false, error: null }));
          return { success: true, message: data.message };
        } else {
          update(state => ({ ...state, loading: false, error: data.error || 'Erro no registro' }));
          return { success: false, error: data.error };
        }
      } catch {
        update(state => ({ ...state, loading: false, error: 'Erro de conexão' }));
        return { success: false, error: 'Erro de conexão' };
      }
    },

    loginWithGoogle: () => {
      window.location.href = `${API}/auth/google`;
    },

    logout: async () => {
      try {
        await fetch(`${API}/auth/logout`, { method: 'POST', credentials: 'include' });
      } catch (err) {
        console.error('Erro no logout:', err);
      } finally {
        set({ user: null, isAuthenticated: false, loading: false, error: null });
      }
    },

    checkAuth: async () => {
      update(state => ({ ...state, loading: true }));
      try {
        const response = await fetch(`${API}/auth/me`, { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          set({ user: data.user, isAuthenticated: true, loading: false, error: null });
        } else {
          set({ user: null, isAuthenticated: false, loading: false, error: null });
        }
      } catch {
        set({ user: null, isAuthenticated: false, loading: false, error: null });
      }
    },

    clearError: () => update(state => ({ ...state, error: null }))
  };
};

export const auth = createAuthStore();
