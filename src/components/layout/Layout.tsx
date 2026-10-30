import { Suspense, useCallback, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useSearchHotkey } from '@/hooks/useHotkey';
import { useReveal } from '@/hooks/useReveal';
import { CommandPalette } from './CommandPalette';
import { Footer } from './Footer';
import { Header } from './Header';
import { SetupChecklist } from './SetupChecklist';

function PageFallback() {
  return (
    <div className="container-page py-16" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading page</span>
      <div className="h-10 w-2/3 max-w-md animate-pulse bg-surface" />
      <div className="mt-4 h-5 w-full max-w-xl animate-pulse bg-surface" />
    </div>
  );
}

export function Layout() {
  const [searchOpen, setSearchOpen] = useState(false);
  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  useSearchHotkey(openSearch);
  useReveal();
  const { pathname, hash } = useLocation();

  // New page: scroll to top and move focus to main content for screen readers.
  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    document.getElementById('main')?.focus({ preventScroll: true });
  }, [pathname, hash]);

  return (
    <div className="flex min-h-svh flex-col">
      <a href="#main" className="sr-only z-50 bg-accent px-4 py-2 text-accent-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      {/* Navigation feedback: a short progress bar, then the new page rises in. */}
      <div key={`progress-${pathname}`} aria-hidden="true" className="route-progress pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] bg-accent" />
      <Header onSearch={openSearch} />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        <div key={pathname} className="page-enter">
          <Suspense fallback={<PageFallback />}>
            <Outlet />
          </Suspense>
        </div>
      </main>
      <Footer />
      <CommandPalette open={searchOpen} onClose={closeSearch} />
      {import.meta.env.DEV && <SetupChecklist />}
    </div>
  );
}
