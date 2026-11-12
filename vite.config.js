// Do not edit. The fake API lives in mock/api-plugin.js; the checks in checks/.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mockApi from './mock/api-plugin.js';

export default defineConfig({
  plugins: [react(), mockApi()],
  server: { port: 5173 },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['checks/**/*.test.{js,jsx}'],
    setupFiles: ['checks/setup.js'],
  },
});
