import { SearchX } from 'lucide-react';
import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { EmptyState } from '@/components/ui/EmptyState';
import { SearchField } from '@/components/ui/Field';
import { PageHeader } from '@/components/ui/PageHeader';
import { CategoryGlyph } from '@/features/achievements/EntryCard';
import { usePageMeta } from '@/hooks/usePageMeta';
import { plural } from '@/lib/cn';
import { groupHits, search } from '@/lib/search';

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  usePageMeta(q ? `Search: ${q}` : 'Search');
  const hits = useMemo(() => search(q), [q]);
  const groups = groupHits(hits);

  return (
    <div className="container-page">
      <PageHeader title="Search" lead="Across all eleven achievement categories and every skill. Searches titles, descriptions, tags, providers and technologies." />
      <div className="py-6">
        <SearchField value={q} onChange={(v) => setParams(v ? { q: v } : {}, { replace: true })} label="Search the portfolio" placeholder="Try SOC, web, Linux, Nmap…" className="max-w-xl" />
        {q && (
          <p className="mt-3 text-sm text-muted" aria-live="polite">
            {plural(hits.length, 'result')} in {plural(groups.length, 'group')}
          </p>
        )}
      </div>
      {!q ? (
        <p className="text-muted">Start typing to search.</p>
      ) : !hits.length ? (
        <EmptyState icon={<SearchX size={28} />} title={`Nothing found for "${q}"`}>
          Check the spelling, or try a broader word like a platform, tool or topic.
        </EmptyState>
      ) : (
        <div key={q} className="space-y-10">
          {groups.map((g) => (
            <section key={g.group} aria-labelledby={`g-${g.group}`}>
              <h2 id={`g-${g.group}`} className="mb-3 flex items-baseline gap-3 text-xl font-medium">
                {g.group} <span className="text-sm font-normal text-muted">{g.hits.length}</span>
              </h2>
              <ul>
                {g.hits.map((h, i) => (
                  <li key={h.key} className="item-in" style={{ animationDelay: `${Math.min(i, 10) * 30}ms` }}>
                    <Link to={h.href} className="flex items-baseline gap-3 px-3 py-3 transition-[background-color,padding] duration-200 hover:bg-surface hover:pl-5">
                      {h.category ? <CategoryGlyph category={h.category} /> : <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-accent" />}
                      <span className="min-w-0">
                        <span className="block text-base font-medium">{h.title}</span>
                        {h.subtitle && <span className="block truncate text-sm text-muted">{h.subtitle}</span>}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
