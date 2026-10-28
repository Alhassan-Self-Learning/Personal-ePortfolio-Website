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
    ui,
    href: entryPath(l.category, l.entry.id),
    status: ui.status(e),
    byline: ui.byline(e),
    facts: ui.cardFacts(e),
    date: entryDateLabel(l.entry as AnyEntry),
    featured: repository.isFeatured(l.category, l.entry.id),
  };
}

export function CategoryGlyph({ category, size = 16, className }: { category: CategoryKey; size?: number; className?: string }) {
  const Icon = getUI(category).icon;
  return <Icon size={size} aria-hidden="true" className={cn(`text-cat-${category}`, className)} />;
}

/**
 * One achievement as a card (grid) or row (list). The whole card is a link
 * target via a stretched ::after on the title link.
 */
export function EntryCard({ item, view = 'grid', showCategory = false, headingLevel = 3 }: { item: Located; view?: 'grid' | 'list'; showCategory?: boolean; headingLevel?: 2 | 3 }) {
  const { href, status, byline, facts, date, featured } = useCardData(item);
  const H = `h${headingLevel}` as 'h2' | 'h3';
  const meta = categoryMeta[item.category];

  if (view === 'list') {
    return (
      <article className="group relative grid grid-cols-[auto,1fr] gap-x-4 gap-y-1 px-4 py-4 transition-colors hover:bg-sunken/50 sm:grid-cols-[auto,1fr,auto] sm:items-center">
        <span className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-cat-${item.category}/10 sm:mt-0`}>
          <CategoryGlyph category={item.category} />
        </span>
        <div className="min-w-0">
          <H className="font-medium leading-snug">
            <Link to={href} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none group-has-[:focus-visible]:underline">
              {item.entry.title}
            </Link>
          </H>
          <p className="truncate text-sm text-muted">
            {showCategory ? `${meta.singular}, ` : ''}
            {byline}
          </p>
        </div>
        <div className="col-start-2 flex flex-wrap items-center gap-2 text-sm text-muted sm:col-start-3 sm:justify-end">
          {item.entry.sample && <SampleBadge />}
          {date && <span className="whitespace-nowrap">{date}</span>}
          {status && <Badge tone={status.tone} dot>{status.label}</Badge>}
        </div>
      </article>
    );
  }

  return (
    <article className="group relative flex h-full flex-col rounded-xl border border-line bg-surface p-5 transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-muted/50 hover:shadow-[0_12px_32px_-20px_rgb(var(--ink)/0.35)] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent">
      <div className="mb-4 flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 text-sm text-muted">
          <CategoryGlyph category={item.category} />
          {showCategory ? meta.singular : date || 'Undated'}
        </span>
        <span className="flex items-center gap-1.5">
          {featured && <Star size={14} aria-label="Featured" className="fill-accent text-accent" />}
          {item.entry.sample && <SampleBadge />}
        </span>
      </div>
      <H className="font-display text-lg font-semibold leading-snug">
        <Link to={href} className="after:absolute after:inset-0 after:rounded-xl after:content-[''] focus-visible:outline-none">
          {item.entry.title}
        </Link>
      </H>
      {byline && <p className="mt-1 text-sm text-muted">{byline}</p>}
      <p className="mt-3 line-clamp-3 text-[0.95rem] leading-relaxed text-ink/80">{item.entry.summary}</p>
      <div className="mt-auto flex flex-wrap items-center gap-2 pt-5 text-xs text-muted">
        {status && <Badge tone={status.tone} dot>{status.label}</Badge>}
        {showCategory && date && <span>{date}</span>}
        {facts.slice(0, 3).map((f) => (
          <span key={f} className="rounded-md bg-sunken px-2 py-0.5">
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
      <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
        {items.map((l) => (
          <li key={`${l.category}/${l.entry.id}`}>
            <EntryCard item={l} view="list" showCategory={showCategory} />
          </li>
        ))}
      </ul>
    );
  }
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((l) => (
        <li key={`${l.category}/${l.entry.id}`}>
          <EntryCard item={l} showCategory={showCategory} />
        </li>
      ))}
    </ul>
  );
}
