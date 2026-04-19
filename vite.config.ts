import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      '@react-three/fiber',
      '@react-three/drei',
      'three'
    ],
    force: true
  },
  build: {
    target: 'esnext'
  },
  server: {
    proxy: {
      '/api/replicate': {
        target: 'https://api.replicate.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/replicate/, ''),
      },
      '/api/elevenlabs': {
        target: 'https://api.elevenlabs.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/elevenlabs/, ''),
      },
      '/api/runway': {
        target: 'https://api.dev.runwayml.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/runway/, ''),
      },
    },
  }
})
