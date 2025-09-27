import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    // Enable subdomain support for localhost
    hmr: {
      port: 5173,
    },
    // Proxy API requests to avoid CORS issues
    proxy: {
      '/api': {
        target: 'http://api-test-board.com:8000',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: {
          'api-test-board.com': 'team-stark.localhost'
        },
      },
    },
  },
});
