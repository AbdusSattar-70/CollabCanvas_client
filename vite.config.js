import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { comlink } from 'vite-plugin-comlink';

export default defineConfig({
  plugins: [
    comlink(),
    react(),
  ],
  worker: {
    plugins: () => [
      comlink(),
    ],
  },
});
