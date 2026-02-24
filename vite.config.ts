import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index',
    },
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      // Keep lit and fast-equals as external — haley-household already has them
      external: ['lit', 'lit/decorators.js', 'lit/directives/repeat.js', 'fast-equals'],
    },
  },
});
