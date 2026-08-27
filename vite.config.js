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
    // vite-plugin-handlebars не отслеживает партиалы для HMR — форсим full-reload.
    {
      name: 'reload-on-partial-change',
      handleHotUpdate({ file, server }) {
        if (file.replace(/\\/g, '/').includes('/partials/')) {
          server.ws.send({ type: 'full-reload' });
          return [];
        }
      },
    },
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(root, 'index.html'),
        services: resolve(root, 'services.html'),
        prices: resolve(root, 'prices.html'),
        booking: resolve(root, 'booking.html'),
        contacts: resolve(root, 'contacts.html'),
        blog: resolve(root, 'blog.html'),
        news: resolve(root, 'news.html'),
        event: resolve(root, 'event.html'),
        notfound: resolve(root, '404.html'),
        thanks: resolve(root, 'thanks.html'),
        offer: resolve(root, 'offer.html'),
        styleguide: resolve(root, 'styleguide.html'),
      },
    },
  },
});
