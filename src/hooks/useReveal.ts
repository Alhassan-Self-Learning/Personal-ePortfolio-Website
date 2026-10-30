import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Staggered entrances: every `.reveal` block's children rise in once as the
 * block enters the viewport. Content is never left hidden: without
 * IntersectionObserver (or with reduced motion, via CSS) it shows at once.
 */
export function useReveal() {
  const { pathname } = useLocation();
  useEffect(() => {
    const show = (el: Element) => el.classList.add('is-in');
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach(show);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            show(e.target);
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    );
    const scan = () => document.querySelectorAll('.reveal:not(.is-in)').forEach((el) => io.observe(el));
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.getElementById('main') ?? document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);
}
