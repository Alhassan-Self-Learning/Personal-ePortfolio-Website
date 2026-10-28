import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { SampleBadge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import { categoryMeta, categoryOrder } from '@/data/categories';
import { CategoryGlyph } from '@/features/achievements/EntryCard';
import { usePageMeta } from '@/hooks/usePageMeta';
import { cn, plural } from '@/lib/cn';
import { entryDateLabel, primaryDateKey, yearOf } from '@/lib/dates';
import { repository } from '@/lib/repository';
import type { CategoryKey, Located } from '@/types/content';

function TimelineItem({ l }: { l: Located }) {
  return (
    <li className="relative pl-10">
      <span aria-hidden="true" className={`absolute left-[7px] top-[0.55rem] h-[11px] w-[11px] rounded-full ring-4 ring-bg bg-cat-${l.category}`} />
      <Link to={`${categoryMeta[l.category].path}/${l.entry.id}`} className="group block rounded-lg py-2">
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
          <span className="tabular-nums">{entryDateLabel(l.entry) || 'Undated'}</span>
          <span className="inline-flex items-center gap-1.5">
            <CategoryGlyph category={l.category} size={14} />
            {categoryMeta[l.category].singular}
          </span>
          {l.entry.milestone && <span className="text-accent">Milestone</span>}
          {l.entry.sample && <SampleBadge />}
        </span>
        <span className="mt-1 block font-display text-lg font-semibold leading-snug group-hover:text-accent">{l.entry.title}</span>
        <span className="mt-1 block max-w-[64ch] text-sm leading-relaxed text-muted">{l.entry.summary}</span>
      </Link>
    </li>
  );
}

export default function JourneyPage() {
  usePageMeta('Learning journey', 'A timeline of courses, labs, projects and milestones, drawn from the portfolio records.');
  const [params, setParams] = useSearchParams();
  const milestonesOnly = params.get('milestones') === '1';
  const show = params.get('show') ?? '';
  const selected = useMemo(() => show.split(',').filter((c) => c in categoryMeta) as CategoryKey[], [show]);

  const set = (k: string, v: string) => {
    const next = new URLSearchParams(params);
    if (v) next.set(k, v);
    else next.delete(k);
    setParams(next, { replace: true });
  };
  const toggleCat = (c: CategoryKey) => {
    const s = new Set(selected);
    if (s.has(c)) s.delete(c);
    else s.add(c);
    set('show', [...s].join(','));
  };

  const counts = repository.getCounts();
  const { years, undated, shown } = useMemo(() => {
    const list = repository
      .getAll()
      .filter((l) => (!selected.length || selected.includes(l.category)) && (!milestonesOnly || l.entry.milestone));
    const dated = list.filter((l) => primaryDateKey(l.entry)).sort((a, b) => primaryDateKey(b.entry).localeCompare(primaryDateKey(a.entry)));
    const years = new Map<string, Located[]>();
    dated.forEach((l) => {
      const y = yearOf(primaryDateKey(l.entry));
      if (!years.has(y)) years.set(y, []);
      years.get(y)!.push(l);
    });
    return { years: [...years.entries()], undated: list.filter((l) => !primaryDateKey(l.entry)), shown: list.length };
  }, [selected, milestonesOnly]);

  return (
    <div className="container-page pb-20">
      <PageHeader
        title="Learning journey"
        lead="Every dated entry from every category on one line, newest first. Nothing here is written twice — it's assembled from the records themselves."
      />

      <div className="flex flex-col gap-4 py-6">
        <div role="group" aria-label="Show categories" className="flex flex-wrap gap-2">
          {categoryOrder
            .filter((c) => counts[c] > 0)
            .map((c) => {
              const on = selected.includes(c);
              return (
                <button
                  key={c}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggleCat(c)}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-colors',
                    on ? `border-cat-${c}/40 bg-cat-${c}/10 text-ink` : 'border-line text-muted hover:text-ink',
                  )}
                >
                  <CategoryGlyph category={c} size={14} />
                  {categoryMeta[c].label}
                </button>
              );
            })}
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <label className="inline-flex cursor-pointer items-center gap-2">
            <input type="checkbox" checked={milestonesOnly} onChange={(e) => set('milestones', e.target.checked ? '1' : '')} className="h-4 w-4 accent-[rgb(var(--accent))]" />
            Milestones only
          </label>
          <span className="text-muted" aria-live="polite">
            {plural(shown, 'entry', 'entries')}
          </span>
          {(selected.length > 0 || milestonesOnly) && (
            <button type="button" className="link" onClick={() => setParams({}, { replace: true })}>
              Show everything
            </button>
          )}
        </div>
      </div>

      {shown === 0 ? (
        <EmptyState title="Nothing on the timeline for this view">Choose more categories, or turn off "Milestones only".</EmptyState>
      ) : (
        <div className="relative">
          <span aria-hidden="true" className="absolute bottom-0 left-[12px] top-2 w-px bg-line" />
          {years.map(([year, items]) => (
            <section key={year} aria-labelledby={`y-${year}`} className="pb-8">
              <h2 id={`y-${year}`} className="relative mb-2 pl-10 font-display text-display-md">
                <span aria-hidden="true" className="absolute left-[3px] top-1/2 h-[19px] w-[19px] -translate-y-1/2 rounded-full border-2 border-accent bg-bg" />
                {year}
              </h2>
              <ol className="space-y-2">
                {items.map((l) => (
                  <TimelineItem key={`${l.category}/${l.entry.id}`} l={l} />
                ))}
              </ol>
            </section>
          ))}
          {undated.length > 0 && (
            <section aria-labelledby="y-undated" className="pb-4">
              <h2 id="y-undated" className="relative mb-1 pl-10 font-display text-display-md text-muted">
                <span aria-hidden="true" className="absolute left-[3px] top-1/2 h-[19px] w-[19px] -translate-y-1/2 rounded-full border-2 border-dashed border-muted bg-bg" />
                Not yet dated
              </h2>
              <p className="mb-3 pl-10 text-sm text-muted">Add a date to these entries to place them on the timeline.</p>
              <ol className="space-y-2">
                {undated.map((l) => (
                  <TimelineItem key={`${l.category}/${l.entry.id}`} l={l} />
                ))}
              </ol>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
