import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    // the Firebase SDK (~560 kB, ~140 kB gzipped) is one chunk, loaded only by the
    // Film Kapışması host and phone pages, never by the emoji game
    chunkSizeWarningLimit: 700,
  },
})
