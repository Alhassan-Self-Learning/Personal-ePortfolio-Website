import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge, SampleBadge } from '@/components/ui/Badge';
import { categoryMeta, entryPath } from '@/data/categories';
import { cn } from '@/lib/cn';
import { entryDateLabel } from '@/lib/dates';
import { repository } from '@/lib/repository';
import type { AnyEntry, CategoryKey, Located } from '@/types/content';
import { getUI } from './registry';

function useCardData(l: Located) {
  const ui = getUI(l.category as CategoryKey);
  const e = l.entry as never;
  return {
    href: entryPath(l.category, l.entry.id),
    status: ui.status(e),
    byline: ui.byline(e),
    facts: ui.cardFacts(e),
    date: entryDateLabel(l.entry as AnyEntry),
    featured: repository.isFeatured(l.category, l.entry.id),
  };
}

/** A category's mark: a small dot in its colour. */
export function CategoryGlyph({ category, size = 10, className }: { category: CategoryKey; size?: number; className?: string }) {
  return <span aria-hidden="true" style={{ width: size, height: size }} className={cn(`inline-block shrink-0 rounded-full bg-cat-${category}`, className)} />;
}

/**
 * One achievement as a card (grid) or a ledger row (list). The whole card is
 * the link target via a stretched ::after on the title link.
 */
export function EntryCard({ item, view = 'grid', showCategory = false, headingLevel = 3 }: { item: Located; view?: 'grid' | 'list'; showCategory?: boolean; headingLevel?: 2 | 3 }) {
  const { href, status, byline, facts, date, featured } = useCardData(item);
  const H = `h${headingLevel}` as 'h2' | 'h3';
  const meta = categoryMeta[item.category];

  if (view === 'list') {
    return (
      <article className="group relative grid grid-cols-[auto,1fr] items-baseline gap-x-4 gap-y-1 px-3 py-4 transition-[background-color,padding] duration-200 hover:bg-surface hover:pl-5 active:scale-[0.995] sm:grid-cols-[auto,1fr,auto]">
        <CategoryGlyph category={item.category} className="translate-y-[-1px]" />
        <div className="min-w-0">
          <H className="text-base font-medium leading-snug">
            <Link to={href} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none group-has-[:focus-visible]:underline">
              {item.entry.title}
            </Link>
          </H>
          <p className="truncate text-sm text-muted">
            {showCategory ? `${meta.singular}, ` : ''}
            {byline}
          </p>
        </div>
        <div className="col-start-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm sm:col-start-3 sm:justify-end">
          {item.entry.sample && <SampleBadge />}
          {date && <span className="whitespace-nowrap tabular-nums text-muted">{date}</span>}
          {status && <Badge tone={status.tone}>{status.label}</Badge>}
        </div>
      </article>
    );
  }

  return (
    <article className="group relative flex h-full flex-col bg-surface p-6 transition-[background-color,transform] duration-300 ease-out hover:-translate-y-1 hover:bg-sunken active:translate-y-0 active:scale-[0.99] has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent">
      <div className="mb-5 flex items-center justify-between gap-2 text-sm">
        <span className="flex items-center gap-2 text-muted">
          <CategoryGlyph category={item.category} />
          {showCategory ? meta.singular : date || 'Undated'}
        </span>
        <span className="flex items-center gap-2">
          {featured && <Star size={15} aria-label="Featured" className="fill-field text-field" />}
          {item.entry.sample && <SampleBadge />}
        </span>
      </div>
      <H className="text-xl font-medium leading-snug">
        <Link to={href} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
          {item.entry.title}
        </Link>
      </H>
      {byline && <p className="mt-1 text-sm text-muted">{byline}</p>}
      <p className="mt-4 line-clamp-3 text-base text-ink">{item.entry.summary}</p>
      <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-6 text-sm">
        {status && <Badge tone={status.tone}>{status.label}</Badge>}
        {showCategory && date && <span className="text-muted">{date}</span>}
        {facts.slice(0, 2).map((f) => (
          <span key={f} className="text-muted">
            {f}
          </span>
        ))}
      </div>
    </article>
  );
}

export function EntryGrid({ items, view = 'grid', showCategory }: { items: Located[]; view?: 'grid' | 'list'; showCategory?: boolean }) {
  if (view === 'list') {
    return (
      <ul className="reveal">
        {items.map((l, i) => (
          <li key={`${l.category}/${l.entry.id}`} className="item-in" style={{ animationDelay: `${Math.min(i, 12) * 30}ms` }}>
            <EntryCard item={l} view="list" showCategory={showCategory} />
          </li>
        ))}
      </ul>
    );
  }
  return (
    <ul className="reveal grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((l, i) => (
        <li key={`${l.category}/${l.entry.id}`} className="item-in" style={{ animationDelay: `${Math.min(i, 12) * 40}ms` }}>
          <EntryCard item={l} showCategory={showCategory} />
        </li>
      ))}
    </ul>
  );
}
