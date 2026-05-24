import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  root: 'demo',
  base: '/replace-react-contexify/', // GitHub Pages base path
  resolve: {
    alias: {
      'replace-react-contexify': resolve(__dirname, 'src/index.ts'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
  build: {
    outDir: '../docs',
    emptyOutDir: true,
  },
});
