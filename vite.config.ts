
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // base: './' ensures paths are relative, fixing the "black screen" on GitHub Pages subpaths
  base: './',
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
  },
  define: {
    // This allows process.env.API_KEY to be accessible in the browser
    'process.env': process.env
  }
});
