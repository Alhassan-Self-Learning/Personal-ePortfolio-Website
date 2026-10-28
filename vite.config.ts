/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig, type Plugin } from 'vite';
import { rawCollections } from './src/data/achievements';
import { categoryMeta, categoryOrder } from './src/data/categories';
import { site } from './src/data/site';

const description = site.profile.shortBio;
const title = `${site.profile.fullName} — ${site.profile.headline}`;

/** Emits robots.txt always, and sitemap.xml when site.url is configured. */
function seoFiles(): Plugin {
  return {
    name: 'portfolio-seo-files',
    apply: 'build',
    generateBundle() {
      const base = site.url?.replace(/\/$/, '');
      const robots = ['User-agent: *', 'Allow: /', base ? `Sitemap: ${base}/sitemap.xml` : ''].filter(Boolean).join('\n');
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots + '\n' });
      if (!base) return;
      const show = (e: { sample?: boolean }) => site.content.showSampleData || !e.sample;
      const paths = ['/', '/about', '/skills', '/achievements', '/journey', '/contact', '/search'];
      for (const k of categoryOrder) {
        paths.push(categoryMeta[k].path);
        for (const e of rawCollections[k] as Array<{ id: string; sample?: boolean }>) if (show(e)) paths.push(`${categoryMeta[k].path}/${e.id}`);
      }
      const xml =
        '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
        paths.map((p) => `  <url><loc>${base}${p}</loc></url>`).join('\n') +
        '\n</urlset>\n';
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: xml });
    },
  };
}

/** Fills %VITE_SITE_*% placeholders in index.html from the site config. */
function htmlMeta(): Plugin {
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  return {
    name: 'portfolio-html-meta',
    transformIndexHtml: (html) =>
      html.replace(/%VITE_SITE_TITLE%/g, esc(title)).replace(/%VITE_SITE_DESCRIPTION%/g, esc(description)),
  };
}

export default defineConfig({
  plugins: [react(), htmlMeta(), seoFiles()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  build: {
    rollupOptions: {
      output: {
        manualChunks: { react: ['react', 'react-dom', 'react-router-dom'] },
      },
    },
  },
  test: { environment: 'node', include: ['tests/**/*.test.ts'] },
});
