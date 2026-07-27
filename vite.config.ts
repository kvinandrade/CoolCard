import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Domínio próprio (coolcard.is-a.dev) serve na raiz
export default defineConfig({
  base: '/',
  plugins: [react()],
})
