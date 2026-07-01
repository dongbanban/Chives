import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    tanstackRouter({ target: 'react', autoCodeSplitting: true }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    allowedHosts: ['.trycloudflare.com'],
    warmup: {
      clientFiles: ['./src/main.tsx', './src/routes/__root.tsx', './index.html'],
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'echarts', '@tanstack/react-query', '@tanstack/react-router'],
  },
})
