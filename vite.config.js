import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',

      manifest: {
        name: 'Elfinic - Online Shopping',
        short_name: 'Elfinic',
        description: 'Elfinic - Online Shopping Platform',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },

      workbox: {
        // Ensure proper navigation fallback for SPA routing
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api/, /\.[^/?]+$/],

        runtimeCaching: [
          {
            // Cache local images (same-origin)
            urlPattern: ({ request }) =>
              request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'local-images',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
              }
            }
          },
          {
            // Cache external images from admin.elfinic.com
            urlPattern: /^https:\/\/admin\.elfinic\.com\/.*\.(png|jpg|jpeg|gif|svg|webp)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'external-images',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            // API calls to admin.elfinic.com (GET requests - products, categories, brands etc.)
            urlPattern: /^https:\/\/admin\.elfinic\.com\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-data',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 5 // 5 minutes
              },
              cacheableResponse: {
                statuses: [0, 200]
              },
              networkTimeoutSeconds: 10
            }
          },
          {
            // Cache CDN resources (Bootstrap, Font Awesome, etc.)
            urlPattern: /^https:\/\/(cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com)\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'cdn-resources',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            // Cache Google Fonts
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })],
  server: {
    host: true,        // Allow external connections
    port: 8080,        // Use a different common port
    strictPort: false, // Allow port switching if busy
  },
  build: {
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Better error handling for production
    rollupOptions: {
      onwarn: (warning, warn) => {
        // Suppress certain warnings in production
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
        warn(warning);
      },
      output: {
        // Better chunk splitting for production
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['react-router-dom', 'react-toastify'],
          'utils': ['axios']
        }
      }
    },
    // Source map configuration
    sourcemap: process.env.NODE_ENV !== 'production'
  },
  // Environment variables
  define: {
    // Ensure environment variables are available in production
    __DEV__: process.env.NODE_ENV === 'development'
  }
})
