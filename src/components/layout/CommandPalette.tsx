import { CornerDownLeft, Search, Sparkles } from 'lucide-react';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog } from '@/components/ui/Dialog';
import { CategoryGlyph } from '@/features/achievements/EntryCard';
import { cn } from '@/lib/cn';
import { groupHits, search } from '@/lib/search';

const suggestions = ['SOC', 'Web', 'Linux', 'Cryptography', 'TryHackMe'];

/** Global search across all achievement categories and skills. */
export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  const hits = useMemo(() => search(q).slice(0, 30), [q]);
  const groups = useMemo(() => groupHits(hits), [hits]);
  const flat = groups.flatMap((g) => g.hits);

  useEffect(() => {
    if (open) {
      setQ('');
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);
  useEffect(() => setActive(0), [q]);

  const go = (href: string) => {
    onClose();
    navigate(href);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, flat.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (flat[active]) go(flat[active].href);
      else if (q.trim()) go(`/search?q=${encodeURIComponent(q.trim())}`);
    }
  };

  let i = -1;
  return (
    <Dialog open={open} onClose={onClose} label="Search the portfolio" className="mt-[10vh] self-start" bare>
      <div className="flex items-center gap-3 border-b border-line px-4">
        <Search size={18} aria-hidden="true" className="text-muted" />
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={onKey}
          placeholder="Search labs, projects, skills, certifications…"
          aria-label="Search"
          role="combobox"
          aria-expanded={flat.length > 0}
          aria-controls={listId}
          aria-activedescendant={flat[active] ? `${listId}-${active}` : undefined}
          className="h-14 w-full bg-transparent text-base outline-none placeholder:text-muted/80"
        />
        <kbd className="hidden rounded border border-line px-1.5 text-xs text-muted sm:inline">Esc</kbd>
      </div>
      <div className="max-h-[60vh] overflow-y-auto p-2">
        {!q.trim() ? (
          <div className="p-3">
            <p className="mb-3 flex items-center gap-2 text-sm text-muted">
              <Sparkles size={14} aria-hidden="true" /> Try searching for
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button key={s} type="button" onClick={() => setQ(s)} className="rounded-md border border-line px-2.5 py-1 text-sm hover:border-accent hover:text-accent">
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : flat.length === 0 ? (
          <p className="p-6 text-center text-sm text-muted">No matches for "{q}". Try a tool, platform or topic name.</p>
        ) : (
          <ul id={listId} role="listbox" aria-label="Results">
            {groups.map((g) => (
              <li key={g.group} role="presentation">
                <p className="px-3 pb-1 pt-3 text-xs font-medium text-muted">{g.group}</p>
                <ul role="presentation">
                  {g.hits.map((h) => {
                    i += 1;
                    const idx = i;
                    return (
                      <li
                        key={h.key}
                        id={`${listId}-${idx}`}
                        role="option"
                        aria-selected={active === idx}
                        onMouseEnter={() => setActive(idx)}
                        onClick={() => go(h.href)}
                        className={cn('flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5', active === idx && 'bg-sunken')}
                      >
                        {h.category ? <CategoryGlyph category={h.category} /> : <span className="h-4 w-4 rounded-full border-2 border-accent" aria-hidden="true" />}
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium">{h.title}</span>
                          {h.subtitle && <span className="block truncate text-xs text-muted">{h.subtitle}</span>}
                        </span>
                        {active === idx && <CornerDownLeft size={14} aria-hidden="true" className="text-muted" />}
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
      {q.trim() && (
        <div className="border-t border-line px-4 py-2.5 text-sm">
          <button type="button" className="link" onClick={() => go(`/search?q=${encodeURIComponent(q.trim())}`)}>
            See all results for "{q.trim()}"
          </button>
        </div>
      )}
    </Dialog>
  );
}
