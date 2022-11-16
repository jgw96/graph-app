import { defineConfig } from 'vite';
// import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  server: {
    port: 8000,
  },
  build: {
    sourcemap: true,
    assetsDir: "code",
  },
  plugins: [

  ]
})
