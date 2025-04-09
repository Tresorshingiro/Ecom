import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      'process.env': env,
    },
    resolve: {
      extensions: ['.js', '.jsx', '.json'],
      dedupe: ['react', 'react-dom', 'react-router-dom'],
      alias: {
        // This is the key fix - redirect react-router imports to react-router-dom
        'react-router': 'react-router-dom',
      }
    },
    build: {
      commonjsOptions: {
        include: [/node_modules/],
      },
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_BACKEND_URL || 'https://umuheto-backend.onrender.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/api'),
        },
      },
    },
  };
});