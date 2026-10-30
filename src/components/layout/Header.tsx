import { Moon, Search, Sun } from 'lucide-react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { IconButton } from '@/components/ui/Button';
import { Monogram } from '@/components/ui/Monogram';
import { allPages, navigation } from '@/data/navigation';
import { site } from '@/data/site';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/cn';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const next = theme === 'dark' ? 'light' : 'dark';
  return (
    <IconButton label={`Switch to ${next} theme`} onClick={toggle} aria-pressed={theme === 'dark'}>
      <span key={theme} className="turn-in inline-flex">
        {theme === 'dark' ? <Sun size={19} aria-hidden="true" /> : <Moon size={19} aria-hidden="true" />}
      </span>
    </IconButton>
  );
}

const linkClass = ({ isActive }: { isActive: boolean }) => cn('relative block py-2 text-base transition-colors duration-200', isActive ? 'text-ink' : 'text-muted hover:text-ink');

/**
 * Desktop navigation with one underline that slides between links: it sits
 * under the current page, follows the pointer while hovering, and glides to
 * the new page after a click.
 */
function DesktopNav() {
  const { pathname } = useLocation();
  const listRef = useRef<HTMLUListElement>(null);
  const [bar, setBar] = useState<{ left: number; width: number; on: boolean }>({ left: 0, width: 0, on: false });

  const activeLink = useCallback(() => {
    const links = [...(listRef.current?.querySelectorAll<HTMLAnchorElement>('a') ?? [])];
    return links.find((a) => a.getAttribute('aria-current') === 'page') ?? null;
  }, []);

  const moveTo = useCallback((el: HTMLElement | null) => {
    if (!el || !listRef.current) return setBar((b) => ({ ...b, on: false }));
    const box = listRef.current.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    setBar({ left: r.left - box.left, width: r.width, on: true });
  }, []);

  useLayoutEffect(() => {
    const id = requestAnimationFrame(() => moveTo(activeLink()));
    return () => cancelAnimationFrame(id);
  }, [pathname, moveTo, activeLink]);

  useEffect(() => {
    const onResize = () => moveTo(activeLink());
    window.addEventListener('resize', onResize);
    document.fonts?.ready.then(onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [moveTo, activeLink]);

  return (
    <nav aria-label="Main" className="ml-auto hidden lg:block">
      <ul ref={listRef} className="relative flex items-center gap-6" onMouseLeave={() => moveTo(activeLink())}>
        {navigation.map((n) => (
          <li key={n.to} onMouseEnter={(e) => moveTo(e.currentTarget.querySelector('a'))}>
            <NavLink to={n.to} className={linkClass} onFocus={(e) => moveTo(e.currentTarget)} onBlur={() => moveTo(activeLink())}>
              {n.label}
            </NavLink>
          </li>
        ))}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0.5 left-0 h-[2px] bg-ink transition-[transform,width,opacity] duration-300 ease-[cubic-bezier(0.3,0.7,0.2,1)]"
          style={{ width: bar.width, transform: `translateX(${bar.left}px)`, opacity: bar.on ? 1 : 0 }}
        />
      </ul>
    </nav>
  );
}

/** A plain bar on the page ground: wordmark, links, search, theme, one action. */
export function Header({ onSearch }: { onSearch: () => void }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    menuRef.current?.querySelector<HTMLElement>('a')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 bg-bg">
      <div className="container-page flex h-16 items-center gap-6">
        <Link to="/" className="flex items-center gap-3" aria-label={`${site.profile.displayName}, home`}>
          <Monogram size={34} />
          <span className="hidden text-base font-medium sm:inline">{site.profile.displayName}</span>
        </Link>

        <DesktopNav />

        <div className="ml-auto flex items-center gap-1 lg:ml-2">
          <IconButton label="Search the portfolio (Ctrl K)" onClick={onSearch}>
            <Search size={19} aria-hidden="true" />
          </IconButton>
          <ThemeToggle />
          <Link to="/contact" className="ml-2 hidden h-11 items-center bg-accent px-5 text-base font-medium text-accent-ink transition-colors hover:bg-ink hover:text-bg active:scale-[0.98] sm:inline-flex">
            Contact
          </Link>
          <button
            ref={buttonRef}
            type="button"
            className="ml-1 inline-flex h-11 items-center px-2 text-base font-medium underline decoration-[1.5px] underline-offset-[5px] lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span key={open ? 'close' : 'menu'} className="item-in inline-block">
              {open ? 'Close' : 'Menu'}
            </span>
          </button>
        </div>
      </div>

      <div id="mobile-menu" ref={menuRef} hidden={!open} className={cn('fixed inset-x-0 bottom-0 top-16 overflow-y-auto bg-bg lg:hidden', open && 'sheet-in')}>
        <nav aria-label="Main menu" className="container-page pb-10 pt-4">
          <ul className="grid">
            {allPages.map((n) => (
              <li key={n.to}>
                <NavLink
                  to={n.to}
                  end={n.to === '/'}
                  className={({ isActive }) => cn('flex items-center justify-between py-3 text-display-md', isActive ? 'text-ink' : 'text-muted hover:text-ink')}
                >
                  {n.label}
                  {(pathname === n.to || (n.to !== '/' && pathname.startsWith(n.to))) && <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-field" />}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
