import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        format: 'es', // Ensure Vite builds as ES module
      },
    },
  },
});