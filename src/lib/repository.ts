/**
 * Data-access layer. Pages and components read content only through this
 * module (usually via hooks in src/hooks/useContent.ts).
 *
 * To move to an API later, implement `ContentRepository` with fetch calls and
 * swap the export at the bottom — the presentation layer doesn't change.
 */
import { rawCollections } from '@/data/achievements';
import { categoryOrder } from '@/data/categories';
import { site } from '@/data/site';
import { skills as rawSkills, skillCategories } from '@/data/skills';
import type { AnyEntry, CategoryKey, EntryByCategory, Located, Ref, Skill, SkillCategory } from '@/types/content';
import { primaryDateKey } from './dates';

export interface ContentRepository {
  getCollection<K extends CategoryKey>(category: K): EntryByCategory[K][];
  getEntry<K extends CategoryKey>(category: K, id: string): EntryByCategory[K] | undefined;
  getAll(): Located[];
  getCounts(): Record<CategoryKey, number>;
  resolve(ref: Ref): Located | undefined;
  getRelated(category: CategoryKey, entry: AnyEntry, limit?: number): Located[];
  getFeatured(): Located[];
  isFeatured(category: CategoryKey, id: string): boolean;
  getSkills(): Skill[];
  getSkill(id: string): Skill | undefined;
  getSkillCategories(): SkillCategory[];
  getSkillEvidence(skillId: string): Located[];
}

const isVisible = (item: { sample?: boolean }) => site.content.showSampleData || !item.sample;

const collections = Object.fromEntries(
  categoryOrder.map((k) => [k, (rawCollections[k] as AnyEntry[]).filter(isVisible)]),
) as { [K in CategoryKey]: EntryByCategory[K][] };

const all: Located[] = categoryOrder.flatMap((category) =>
  (collections[category] as AnyEntry[]).map((entry) => ({ category, entry }) as Located),
);

const byKey = new Map(all.map((l) => [`${l.category}/${l.entry.id}`, l]));
const visibleSkills = rawSkills.filter(isVisible);
const skillById = new Map(visibleSkills.map((s) => [s.id, s]));

const sameRef = (a: Ref, b: Ref) => a.category === b.category && a.id === b.id;

function resolve(ref: Ref): Located | undefined {
  return byKey.get(`${ref.category}/${ref.id}`);
}

const featuredRefs = site.featured.filter((r) => resolve(r));

export const localRepository: ContentRepository = {
  getCollection: (category) => collections[category],
  getEntry: (category, id) => collections[category].find((e) => e.id === id),
  getAll: () => all,
  getCounts: () =>
    Object.fromEntries(categoryOrder.map((k) => [k, collections[k].length])) as Record<CategoryKey, number>,
  resolve,

  /**
   * Related entries, in priority order:
   * 1. records this entry links to, 2. records that link to this entry,
   * 3. records sharing the most skills (to fill up to `limit`).
   */
  getRelated(category, entry, limit = 6) {
    const self: Ref = { category, id: entry.id };
    const out: Located[] = [];
    const seen = new Set<string>([`${category}/${entry.id}`]);
    const push = (l?: Located) => {
      if (!l) return;
      const key = `${l.category}/${l.entry.id}`;
      if (seen.has(key)) return;
      seen.add(key);
      out.push(l);
    };
    (entry.related ?? []).forEach((r) => push(resolve(r)));
    all.filter((l) => (l.entry.related ?? []).some((r) => sameRef(r, self))).forEach(push);
    const mine = new Set(entry.skills ?? []);
    if (out.length < limit && mine.size) {
      all
        .map((l) => ({ l, score: (l.entry.skills ?? []).filter((s) => mine.has(s)).length }))
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score || primaryDateKey(b.l.entry).localeCompare(primaryDateKey(a.l.entry)))
        .forEach((x) => out.length < limit && push(x.l));
    }
    return out.slice(0, limit);
  },

  getFeatured: () => featuredRefs.map((r) => resolve(r)!).filter(Boolean),
  isFeatured: (category, id) => featuredRefs.some((r) => r.category === category && r.id === id),
  getSkills: () => visibleSkills,
  getSkill: (id) => skillById.get(id),
  getSkillCategories: () => skillCategories,
  getSkillEvidence: (skillId) => all.filter((l) => (l.entry.skills ?? []).includes(skillId)),
};

export const repository: ContentRepository = localRepository;
