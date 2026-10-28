import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { site } from '@/data/site';

function setMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

/** Sets the document title, description, Open Graph tags and canonical URL. */
export function usePageMeta(title: string | undefined, description?: string) {
  const { pathname } = useLocation();
  useEffect(() => {
    const name = site.profile.fullName;
    const full = title ? `${title} | ${name}` : `${name} — ${site.profile.headline}`;
    const desc = description || site.profile.shortBio;
    document.title = full;
    setMeta('meta[name="description"]', 'name', 'description', desc);
    setMeta('meta[property="og:title"]', 'property', 'og:title', full);
    setMeta('meta[property="og:description"]', 'property', 'og:description', desc);
    if (site.url) {
      const url = site.url.replace(/\/$/, '') + pathname;
      setMeta('meta[property="og:url"]', 'property', 'og:url', url);
      let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = url;
    }
  }, [title, description, pathname]);
}
