import { Menu, Moon, Search, Sun, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { IconButton } from '@/components/ui/Button';
import { Monogram } from '@/components/ui/Monogram';
import { navigation } from '@/data/navigation';
import { site } from '@/data/site';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/cn';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const next = theme === 'dark' ? 'light' : 'dark';
  return (
    <IconButton label={`Switch to ${next} theme`} onClick={toggle} aria-pressed={theme === 'dark'}>
      {theme === 'dark' ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
    </IconButton>
  );
}

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'relative px-2.5 py-2 text-sm transition-colors after:absolute after:inset-x-2.5 after:-bottom-px after:h-0.5 after:origin-left after:rounded-full after:bg-accent after:transition-transform after:duration-300',
    isActive ? 'text-ink after:scale-x-100' : 'text-muted hover:text-ink after:scale-x-0 hover:after:scale-x-50',
  );

export function Header({ onSearch }: { onSearch: () => void }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setOpen(false), [pathname]);

  // Mobile menu: Escape closes and returns focus; focus moves into the menu on open.
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
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="glass sticky top-0 z-40 border-b border-line">
      <div className="container-page flex h-16 items-center gap-4">
        <Link to="/" className="flex items-center gap-3 rounded-lg" aria-label={`${site.profile.displayName}, home`}>
          <Monogram size={34} />
          <span className="hidden font-display text-[1.05rem] font-semibold tracking-tight sm:inline">{site.profile.displayName}</span>
        </Link>

        <nav aria-label="Main" className="ml-auto hidden lg:block">
          <ul className="flex items-center">
            {navigation.map((n) => (
              <li key={n.to}>
                <NavLink to={n.to} end={n.to === '/'} className={linkClass}>
                  {n.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1 lg:ml-2">
          <button
            type="button"
            onClick={onSearch}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-line bg-surface px-2.5 text-sm text-muted transition-colors hover:text-ink"
            aria-label="Search the portfolio"
          >
            <Search size={16} aria-hidden="true" />
            <span className="hidden xl:inline">Search</span>
            <kbd className="hidden rounded border border-line px-1.5 font-sans text-[0.7rem] xl:inline">Ctrl K</kbd>
          </button>
          <ThemeToggle />
          <IconButton
            ref={buttonRef}
            label={open ? 'Close menu' : 'Open menu'}
            className="lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </IconButton>
        </div>
      </div>

      <div
        id="mobile-menu"
        ref={menuRef}
        hidden={!open}
        className="border-t border-line bg-bg lg:hidden"
      >
        <nav aria-label="Main menu" className="container-page py-3">
          <ul className="grid gap-1">
            {navigation.map((n) => (
              <li key={n.to}>
                <NavLink
                  to={n.to}
                  end={n.to === '/'}
                  className={({ isActive }) =>
                    cn('flex items-center justify-between rounded-lg px-3 py-3 text-base', isActive ? 'bg-sunken font-medium text-ink' : 'text-muted hover:bg-sunken/60 hover:text-ink')
                  }
                >
                  {n.label}
                  {pathname === n.to && <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
