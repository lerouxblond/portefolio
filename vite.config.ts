import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages sert le site sous https://lerouxblond.github.io/portefolio/
export default defineConfig({
  base: '/portefolio/',
  plugins: [react()],
})
