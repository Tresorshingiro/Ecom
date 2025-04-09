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
      dedupe: ['react', 'react-dom'],
      alias: {
        'react-router': 'react-router-dom',
      }
    },
    optimizeDeps: {
      include: ['react-router-dom'],
      esbuildOptions: {
        target: 'es2020'
      }
    },
    build: {
      outDir: 'dist',
      target: 'es2020',
      minify: 'esbuild',
      rollupOptions: {
        onwarn(warning, warn) {
          if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
          warn(warning);
        }
      }
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