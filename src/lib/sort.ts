import type { AnyEntry, CategoryKey } from '@/types/content';
import { primaryDateKey } from './dates';
import { repository } from './repository';

export type SortMode = 'newest' | 'oldest' | 'alpha' | 'featured';

export const sortLabels: Record<SortMode, string> = {
  newest: 'Newest first',
  oldest: 'Oldest first',
  alpha: 'A to Z',
  featured: 'Featured first',
};

/** Undated entries always sort after dated ones. */
export function sortEntries<T extends AnyEntry>(entries: T[], mode: SortMode, category: CategoryKey): T[] {
  const byDate = (dir: 1 | -1) => (a: T, b: T) => {
    const ka = primaryDateKey(a);
    const kb = primaryDateKey(b);
    if (!ka && !kb) return a.title.localeCompare(b.title);
    if (!ka) return 1;
    if (!kb) return -1;
    return dir * ka.localeCompare(kb) || a.title.localeCompare(b.title);
  };
  const list = [...entries];
  switch (mode) {
    case 'oldest':
      return list.sort(byDate(1));
    case 'alpha':
      return list.sort((a, b) => a.title.localeCompare(b.title));
    case 'featured': {
      const newest = byDate(-1);
      const f = (e: T) => (repository.isFeatured(category, e.id) ? 0 : 1);
      return list.sort((a, b) => f(a) - f(b) || newest(a, b));
    }
    default:
      return list.sort(byDate(-1));
  }
}
