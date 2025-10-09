import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [svelte()],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, '.cert/localhost.key')),
      cert: fs.readFileSync(path.resolve(__dirname, '.cert/localhost.crt')),
    },
    host: 'localhost',
    port: 5173,
  },

})
