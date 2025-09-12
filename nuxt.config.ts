// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@vite-pwa/nuxt"],
  css: ["~/assets/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
   pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Can Do',
      short_name: 'Can Do',
      description: 'Your Voice, Your Power',
      theme_color: '#33339C',
      background_color: '#33339C',
      display: 'standalone',
      scope: '/',
      start_url: '/',
      icons: [
        {
          src: '/android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    },
    workbox: {
      navigateFallback: '/',
    },
    devOptions: {
      enabled: true, // Enable PWA during development
    },
  }
});
