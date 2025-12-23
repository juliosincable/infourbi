import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'
import { VitePWA } from 'vite-plugin-pwa'

// Esto arregla el error de la propiedad "test"
/// <reference types="vitest" />
/// <reference types="vite/client" />

export default defineConfig({
  plugins: [
    react(),
    legacy(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'InfoUrbi',
        short_name: 'InfoUrbi',
        description: 'Plataforma infoUrbi',
        theme_color: '#0077B6',
        icons: [
          {
            src: 'pwa-icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('firebase')) return 'vendor-fb';
            if (id.includes('@ionic')) return 'vendor-ui';
            return 'vendor-core';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  // @ts-expect-error - Vitest no está en el tipo base de Vite
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  }
})