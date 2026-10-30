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

function TimelineItem({ l, delay = 0 }: { l: Located; delay?: number }) {
  return (
    <li className="item-in" style={{ animationDelay: `${delay}ms` }}>
      <Link
        to={`${categoryMeta[l.category].path}/${l.entry.id}`}
        className="group grid gap-x-8 gap-y-1 px-3 py-5 transition-[background-color,padding] duration-200 hover:bg-surface hover:pl-5 md:grid-cols-[11rem_minmax(0,1fr)_minmax(0,1fr)]"
      >
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm md:flex-col md:items-start">
          <span className="tabular-nums">{entryDateLabel(l.entry) || 'Undated'}</span>
          <span className="inline-flex items-center gap-2 text-muted">
            <CategoryGlyph category={l.category} />
            {categoryMeta[l.category].singular}
          </span>
        </span>
        <span>
          <span className="block text-xl font-medium leading-snug group-hover:text-accent">{l.entry.title}</span>
          <span className="mt-1 flex flex-wrap gap-3 text-sm">
            {l.entry.milestone && <span className="bg-field px-1.5 text-field-ink">Milestone</span>}
            {l.entry.sample && <SampleBadge />}
          </span>
        </span>
        <span className="text-base">{l.entry.summary}</span>
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
    <div className="container-page">
      <PageHeader
        title="Learning journey"
        lead="Every dated entry from every category, newest first, assembled from the records themselves."
      />

      <div className="reveal flex flex-col gap-4 bg-surface p-5 sm:p-6">
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
                    'inline-flex h-10 items-center gap-2 px-3 text-sm transition-colors active:scale-95',
                    on ? 'animate-pop bg-ink text-bg' : 'bg-bg text-ink hover:bg-sunken',
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
        <div key={`${show}|${milestonesOnly}`} className="mt-16 space-y-24">
          {[...years, ...(undated.length ? ([['Not yet dated', undated]] as Array<[string, Located[]]>) : [])].map(([year, items]) => (
            <section key={year} aria-labelledby={`y-${year}`} className="grid gap-6 lg:grid-cols-12 lg:gap-x-6">
              <div className="lg:col-span-3">
                <div>
                  <h2 id={`y-${year}`} className={cn('text-display-lg', year === 'Not yet dated' && 'max-w-[8ch]')}>
                    {year}
                  </h2>
                  <p className="mt-3 text-base">
                    {year === 'Not yet dated' ? 'Add a date to these entries to place them on the timeline.' : plural(items.length, 'entry', 'entries')}
                  </p>
                </div>
              </div>
              <ol className="reveal lg:col-span-9">
                {items.map((l, i) => (
                  <TimelineItem key={`${l.category}/${l.entry.id}`} l={l} delay={Math.min(i, 10) * 35} />
                ))}
              </ol>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
