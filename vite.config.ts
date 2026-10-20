import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    proxy: {
      '/api/auth': {
        target: 'http://localhost:8001',
        changeOrigin: true,
      },
      '/api/masjid': {
        target: 'http://localhost:8002',
        changeOrigin: true,
      },
      '/api/content': {
        target: 'http://localhost:8003',
        changeOrigin: true,
      },
      '/api/transaction': {
        target: 'http://localhost:8004',
        changeOrigin: true,
      },
      '/api/admin': {
        target: 'http://localhost:8005',
        changeOrigin: true,
      },
    },
  },
})
