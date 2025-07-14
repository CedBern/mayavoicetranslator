import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001, // Or any port you prefer
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Your backend server
        changeOrigin: true,
      },
      '/v1': {
        target: 'http://localhost:3000', // Your backend server for v1 routes
        changeOrigin: true,
      }
    }
  }
})
