import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  plugins: [svelte()],
  server: {
    open: "true",
    host: "localhost",
    port: 5173,
  },
  preview: {
    // Configuração para preview (produção)
    // O servidor precisa fazer fallback para index.html
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
