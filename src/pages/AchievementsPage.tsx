import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { categoryMeta, categoryOrder } from '@/data/categories';
import { getUI } from '@/features/achievements/registry';
import { usePageMeta } from '@/hooks/usePageMeta';
import { plural } from '@/lib/cn';
import { primaryDateKey } from '@/lib/dates';
import { repository } from '@/lib/repository';

export default function AchievementsPage() {
  usePageMeta('Achievements', 'Every course, certification, project, lab and event, organised into eleven categories.');
  const counts = repository.getCounts();
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="container-page pb-20">
      <PageHeader
        title="Achievements"
        lead="Everything on record, in eleven categories. Each entry has its own page with details, evidence and related work."
        aside={
          <Link to="/search" className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg border border-line bg-surface px-3 text-sm text-muted hover:text-ink">
            <Search size={16} aria-hidden="true" /> Search all {total} entries
          </Link>
        }
      />
      <ul className="grid gap-4 pt-10 sm:grid-cols-2 lg:grid-cols-3">
        {categoryOrder.map((k) => {
          const meta = categoryMeta[k];
          const Icon = getUI(k).icon;
          const latest = [...repository.getCollection(k)].sort((a, b) => primaryDateKey(b).localeCompare(primaryDateKey(a)))[0];
          const n = counts[k];
          return (
            <li key={k}>
              <Link
                to={meta.path}
                className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface p-5 transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-muted/50"
              >
                <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-1 bg-cat-${k} opacity-70 transition-opacity group-hover:opacity-100`} />
                <span className="flex items-start justify-between gap-4">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-xl bg-cat-${k}/10`}>
                    <Icon size={22} aria-hidden="true" className={`text-cat-${k}`} />
                  </span>
                  <span className={`font-display text-3xl font-semibold tabular-nums ${n ? '' : 'text-muted/60'}`}>{n}</span>
                </span>
                <h2 className="mt-4 font-display text-lg font-semibold group-hover:text-accent">{meta.label}</h2>
                <p className="mb-5 mt-1 text-sm leading-relaxed text-muted">{meta.description}</p>
                <p className="mt-auto border-t border-line pt-3 text-xs text-muted">
                  {latest ? (
                    <>
                      Latest: <span className="text-ink/80">{latest.title}</span>
                    </>
                  ) : (
                    'Nothing here yet'
                  )}
                </p>
                <span className="sr-only">{plural(n, 'entry', 'entries')}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
