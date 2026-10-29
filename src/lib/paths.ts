/**
 * Turns a root-relative path from the content files (e.g. '/cv.pdf') into a
 * URL that works when the site is served from a sub-folder (see site.basePath).
 * Full URLs, mailto: links and the like are returned unchanged.
 */
export function publicUrl(path: string): string {
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  return import.meta.env.BASE_URL.replace(/\/$/, '') + path;
}

/** Router basename derived from Vite's base ('/' when served from the domain root). */
export const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';
