// bep-full-project/vite.config.ts

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import path from 'node:path';

export default defineConfig({
  plugins: [
    react(),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/features': path.resolve(__dirname, './src/features'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/layouts': path.resolve(__dirname, './src/layouts'),
      '@/routes': path.resolve(__dirname, './src/routes'),

      '@/services': path.resolve(__dirname, './src/services'),
      '@/firebase': path.resolve(__dirname, './src/firebase'),

      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/store': path.resolve(__dirname, './src/store'),

      '@/types': path.resolve(__dirname, './src/types'),
      '@/styles': path.resolve(__dirname, './src/styles'),

      '@/lib': path.resolve(__dirname, './src/lib'),
      '@/assets': path.resolve(__dirname, './src/assets'),
    },
  },

  server: {
    host: true,
    port: 5173,

    open: true,

    strictPort: false,
  },

  preview: {
    host: true,
    port: 4173,
  },

  build: {
    target: 'es2020',

    outDir: 'dist',

    sourcemap: false,

    minify: 'esbuild',

    chunkSizeWarningLimit: 1500,

    rollupOptions: {
      output: {
        manualChunks: {
          react: [
            'react',
            'react-dom',
            'react-router-dom',
          ],

          firebase: [
            'firebase/app',
            'firebase/auth',
            'firebase/firestore',
            'firebase/storage',
            'firebase/functions',
          ],

          ui: [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-toast',
            '@radix-ui/react-tabs',
          ],

          charts: [
            'recharts',
          ],

          animation: [
            'framer-motion',
          ],
        },
      },
    },
  },

  css: {
    devSourcemap: true,
  },

  define: {
    __APP_NAME__: JSON.stringify('BEP'),
    __APP_VERSION__: JSON.stringify('1.0.0'),
  },

  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'zustand',
      'firebase/app',
      'firebase/auth',
      'firebase/firestore',
    ],
  },
});
