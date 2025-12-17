import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Очищаем кеш и принудительно обновляем сборку
export default defineConfig({
  plugins: [react()],
  clearScreen: true,
  server: {
    watch: {
      usePolling: true, // следит за всеми изменениями
      interval: 100,
    },
  },
  optimizeDeps: {
    force: true, // заново пересобирает зависимости
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true, // очищает папку при каждой сборке
  },
  cacheDir: 'node_modules/.vite', // путь к кешу
});
