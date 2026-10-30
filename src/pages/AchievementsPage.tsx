import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { categoryMeta, categoryOrder } from '@/data/categories';
import { usePageMeta } from '@/hooks/usePageMeta';
import { plural } from '@/lib/cn';
import { primaryDateKey } from '@/lib/dates';
import { repository } from '@/lib/repository';

/** The hub: an index of the eleven categories, each with its count and latest entry. */
export default function AchievementsPage() {
  usePageMeta('Achievements', 'Every course, certification, project, lab and event, organised into eleven categories.');
  const counts = repository.getCounts();
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="container-page">
      <PageHeader
        title="Achievements"
        lead={`${plural(total, 'entry', 'entries')} in eleven categories. Each entry has its own page with details, evidence and related work.`}
        aside={
          <Link to="/search" className="link shrink-0 text-base">
            Search all entries
          </Link>
        }
      />
      <ul className="reveal grid gap-x-12 md:grid-cols-2">
        {categoryOrder.map((k) => {
          const meta = categoryMeta[k];
          const latest = [...repository.getCollection(k)].sort((a, b) => primaryDateKey(b).localeCompare(primaryDateKey(a)))[0];
          const n = counts[k];
          return (
            <li key={k}>
              <Link to={meta.path} className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-x-4 px-3 py-6 transition-[background-color,padding] duration-300 hover:bg-surface hover:pl-5 active:scale-[0.995]">
                <span aria-hidden="true" className={`h-3 w-3 translate-y-[-2px] rounded-full bg-cat-${k} transition-transform duration-300 group-hover:scale-150`} />
                <span>
                  <span className="block text-xl font-medium group-hover:text-accent">{meta.label}</span>
                  <span className="mt-1 block text-base">{meta.description}</span>
                  <span className="mt-2 block text-sm text-muted">{latest ? `Latest: ${latest.title}` : 'Nothing here yet'}</span>
                </span>
                <span className={`text-display-md tabular-nums ${n ? '' : 'text-muted'}`} aria-label={plural(n, 'entry', 'entries')}>
                  {n}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
