import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/resume-md/',
  server: { port: 7788, strictPort: true, open: true },
});
