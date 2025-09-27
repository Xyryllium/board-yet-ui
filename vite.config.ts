import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  
  return {
    plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
    server: {
      host: '0.0.0.0',
      port: 5173,
      hmr: {
        port: 5173,
      },
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
    build: {
      minify: isProduction ? 'esbuild' : false,
      sourcemap: !isProduction,
      rollupOptions: {
        output: {
          manualChunks: {
            router: ['react-router'],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
      cssCodeSplit: true,
    },
    define: {
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },
  };
});
