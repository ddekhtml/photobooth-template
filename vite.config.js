import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['/icons/dbooth.png'],
      manifest: {
        name: 'D Booth',
        short_name: 'DBooth',
        description: 'Photobooth Web App',
        theme_color: '#000000',
        background_color: '#000000',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/dbooth.png',
            sizes: '500x500',
            type: 'image/png'
          }
        ]
      }
    }), 
  ],
  server: {
    allowedHosts: true 
  }
})
