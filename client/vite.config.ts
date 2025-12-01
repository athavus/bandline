/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  plugins: [svelte()],
  server: {
    open: "true",
    host: "localhost",
    port: 5173,
  },
  preview: {},
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
