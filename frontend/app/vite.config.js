import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  optimizeDeps: {
    include: ['gsap', 'gsap/ScrollTrigger'],
  },
  server: {
    proxy: {
      // Proxy API requests to the backend during development
      '/api': {
        target: 'https://admission-process-2.onrender.com',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'gsap': ['gsap', 'gsap/ScrollTrigger'],
        },
      },
    },
  },
})
