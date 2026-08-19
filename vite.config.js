import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));

// Точки входа добавляются по мере рефактора страниц.
// Старые (ещё dc-runtime) страницы намеренно НЕ в input: они содержат
// {{ }}-биндинги, на которых handlebars-плагин упал бы. Итоговый список —
// все 8 страниц + styleguide.
export default defineConfig({
  root,
  // Слушаем 0.0.0.0, чтобы проброшенный порт devcontainer был доступен снаружи.
  server: {
    host: true,
  },
  plugins: [
    handlebars({
      partialDirectory: resolve(root, 'partials'),
    }),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        services: resolve(root, 'services.html'),
      },
    },
  },
});
