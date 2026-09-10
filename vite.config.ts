import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss()],
  // GitHub Pages sirve el repo en /ferrohogar/, no en la raíz del dominio.
  base: command === 'build' ? '/ferrohogar/' : '/',
}))
