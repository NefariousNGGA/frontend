import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Only for local development
    proxy: {
      '/api': 'http://localhost:3001'
    }
  },
  // Ensure client builds to root-relative paths
  base: '/'
});