
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
    emptyOutDir: true,
  },
  define: {
    // Ensuring variables are strings or empty strings to prevent build breakage
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || ''),
  }
});
