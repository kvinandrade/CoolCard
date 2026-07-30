import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serve o app em /CoolCard/
const base = process.env.GITHUB_ACTIONS ? '/CoolCard/' : '/'

export default defineConfig({
  base,
  plugins: [react()],
})
