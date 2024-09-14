import { defineConfig } from 'vite';

export default defineConfig({
  base: "/app",
  build: {
    rollupOptions: {
      output: {
        format: 'es', // Ensure Vite builds as ES module
      },
    },
  },
});