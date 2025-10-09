import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import fs from 'fs'
import path from 'path'


// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, '.cert/key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, '.cert/cert.pem')),
    },
    host: 'localhost', // ou 0.0.0.0 se quiser expor na rede
    port: 5173,
  },

})
