
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  define: {
    // Only expose the specific API_KEY to the client to prevent Vercel build errors
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
  }
});
