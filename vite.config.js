import { defineConfig } from 'vite';

export default defineConfig({
   server: {
      port: 3000,
      open: process.env.NODE_ENV !== 'production',
   },
   build: {
      outDir: 'dist',
   },
});
