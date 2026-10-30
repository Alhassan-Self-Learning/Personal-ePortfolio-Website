import { LayoutGrid, List, SearchX } from 'lucide-react';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { SearchField, SelectField } from '@/components/ui/Field';
import { PageHeader } from '@/components/ui/PageHeader';
import { categoryMeta } from '@/data/categories';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useStoredState } from '@/hooks/useStoredState';
import { cn, plural } from '@/lib/cn';
import { repository } from '@/lib/repository';
import { entrySearchText, tokenize } from '@/lib/search';
import { sortEntries, sortLabels, type SortMode } from '@/lib/sort';
import type { AnyEntry, CategoryKey, Located } from '@/types/content';
import { EntryGrid } from './EntryCard';
import { getUI, type FilterDef } from './registry';

const SORTS: SortMode[] = ['newest', 'oldest', 'alpha', 'featured'];
const VIEWS = ['grid', 'list'] as const;
const listFirst: CategoryKey[] = ['experience'];

const asArray = (v: string | string[] | undefined) => (v === undefined ? [] : Array.isArray(v) ? v : [v]);

export default function CategoryPage({ category }: { category: CategoryKey }) {
  const meta = categoryMeta[category];
  const ui = getUI(category);
  const Icon = ui.icon;
  usePageMeta(meta.label, meta.description);

  const [params, setParams] = useSearchParams();
  const [view, setView] = useStoredState(`view:${category}`, listFirst.includes(category) ? 'list' : 'grid', VIEWS);
  const q = params.get('q') ?? '';
  const sort = (SORTS.includes(params.get('sort') as SortMode) ? params.get('sort') : 'newest') as SortMode;

  const all = repository.getCollection(category) as AnyEntry[];
  const filters = ui.filters as FilterDef<AnyEntry>[];

  // Options per filter, computed from the data so empty choices never appear.
  const options = useMemo(
    () =>
      filters.map((f) => {
        const counts = new Map<string, number>();
        all.forEach((e) => asArray(f.get(e)).forEach((v) => counts.set(v, (counts.get(v) ?? 0) + 1)));
        return { def: f, values: [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0])) };
      }),
    [all, filters],
  );

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const active = filters.filter((f) => params.get(f.id));
  const results = useMemo(() => {
    const tokens = tokenize(q);
    const filtered = all.filter((e) => {
      if (!filters.every((f) => !params.get(f.id) || asArray(f.get(e)).includes(params.get(f.id)!))) return false;
      if (!tokens.length) return true;
      const text = entrySearchText({ category, entry: e } as Located);
      return tokens.every((t) => text.includes(t));
    });
    return sortEntries(filtered, sort, category).map((entry) => ({ category, entry }) as Located);
  }, [all, filters, params, q, sort, category]);

  const clear = () => setParams(new URLSearchParams(sort !== 'newest' ? { sort } : {}), { replace: true });
  const filtering = !!q || active.length > 0;

  return (
    <div className="container-page">
      <PageHeader
        crumbs={[{ label: 'Achievements', to: '/achievements' }, { label: meta.label }]}
        title={meta.label}
        lead={meta.description}
        aside={<p className="flex shrink-0 items-center gap-3 text-base"><span aria-hidden="true" className={`h-3 w-3 rounded-full bg-cat-${category}`} />{plural(all.length, 'entry', 'entries')}</p>}
      />

      {all.length > 0 && (
        <div className="sticky top-16 z-20 mb-8 bg-bg py-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="text-sm text-muted" aria-hidden="true">
                Search
              </span>
              <SearchField value={q} onChange={(v) => update('q', v)} label={`Search ${meta.label.toLowerCase()}`} placeholder={`Search ${meta.label.toLowerCase()}`} />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-end">
              {options.map(({ def, values }) =>
                values.length > 1 || params.get(def.id) ? (
                  <SelectField key={def.id} label={def.label} value={params.get(def.id) ?? ''} onChange={(v) => update(def.id, v)} className="sm:w-44">
                    <option value="">All</option>
                    {values.map(([v, n]) => (
                      <option key={v} value={v}>
                        {(def.format ?? String)(v)} ({n})
                      </option>
                    ))}
                  </SelectField>
                ) : null,
              )}
              <SelectField label="Sort" value={sort} onChange={(v) => update('sort', v === 'newest' ? '' : v)} className="sm:w-40">
                {SORTS.map((s) => (
                  <option key={s} value={s}>
                    {sortLabels[s]}
                  </option>
                ))}
              </SelectField>
              <div role="group" aria-label="Layout" className="col-span-2 flex h-11 items-center self-end bg-surface p-1 sm:col-span-1">
                {VIEWS.map((v) => {
                  const VIcon = v === 'grid' ? LayoutGrid : List;
                  return (
                    <button
                      key={v}
                      type="button"
                      aria-pressed={view === v}
                      onClick={() => setView(v)}
                      className={cn('inline-flex h-9 flex-1 items-center justify-center gap-1.5 px-3 text-sm transition-colors duration-200 active:scale-95', view === v ? 'animate-pop bg-bg text-ink' : 'text-muted hover:text-ink')}
                    >
                      <VIcon size={15} aria-hidden="true" />
                      <span className="sm:sr-only">{v === 'grid' ? 'Grid' : 'List'}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <p className="mt-3 text-sm text-ink" aria-live="polite">
            {filtering ? `${plural(results.length, 'result')} of ${all.length}` : `Showing all ${plural(all.length, 'entry', 'entries')}`}
            {filtering && (
              <button type="button" onClick={clear} className="link ml-3">
                Clear filters
              </button>
            )}
          </p>
        </div>
      )}

      {all.length === 0 ? (
        <div className="mt-10">
          <EmptyState icon={<Icon size={28} />} title={`No ${meta.label.toLowerCase()} yet`}>
            {meta.emptyHint}
          </EmptyState>
        </div>
      ) : results.length === 0 ? (
        <EmptyState icon={<SearchX size={28} />} title="Nothing matches these filters" action={<Button onClick={clear}>Clear filters</Button>}>
          Try a broader search term, or remove one of the filters.
        </EmptyState>
      ) : (
        <EntryGrid key={`${params.toString()}|${view}`} items={results} view={view} />
      )}
    </div>
  );
}
