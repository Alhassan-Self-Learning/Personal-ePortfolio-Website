import { categoryMeta } from '@/data/categories';
import type { CategoryKey, Located, Skill } from '@/types/content';
import { repository } from './repository';

export interface SearchHit {
  kind: 'entry' | 'skill';
  key: string;
  title: string;
  subtitle: string;
  href: string;
  group: string;
  category?: CategoryKey;
  score: number;
}

const SKIP_FIELDS = new Set(['id', 'related', 'media', 'links', 'skills', 'sample', 'milestone', 'hideCredentialId']);

function collectText(value: unknown, out: string[]) {
  if (typeof value === 'string') out.push(value);
  else if (typeof value === 'number') out.push(String(value));
  else if (Array.isArray(value)) value.forEach((v) => collectText(v, out));
}

/** Everything searchable about an entry, lower-cased. */
export function entrySearchText(l: Located): string {
  const out: string[] = [];
  for (const [key, value] of Object.entries(l.entry)) {
    if (SKIP_FIELDS.has(key)) continue;
    if (key === 'credentialId' && 'hideCredentialId' in l.entry && l.entry.hideCredentialId) continue;
    collectText(value, out);
  }
  (l.entry.skills ?? []).forEach((id) => {
    const s = repository.getSkill(id);
    if (s) out.push(s.name);
  });
  out.push(categoryMeta[l.category].singular);
  return out.join(' \n ').toLowerCase();
}

export function entrySubtitle(l: Located): string {
  const e = l.entry as unknown as Record<string, unknown>;
  const by = ['provider', 'issuer', 'organization', 'organizer', 'platform'].map((k) => e[k]).find(Boolean);
  if (by) return String(by);
  if (Array.isArray(e.authors)) return (e.authors as string[]).join(', ');
  if (typeof e.type === 'string') return e.type;
  return '';
}

export function tokenize(query: string): string[] {
  return query.toLowerCase().split(/\s+/).map((t) => t.trim()).filter(Boolean);
}

interface Indexed {
  hit: Omit<SearchHit, 'score'>;
  title: string;
  text: string;
}

let index: Indexed[] | null = null;

function buildIndex(): Indexed[] {
  const entries: Indexed[] = repository.getAll().map((l) => ({
    hit: {
      kind: 'entry',
      key: `${l.category}/${l.entry.id}`,
      title: l.entry.title,
      subtitle: entrySubtitle(l),
      href: `${categoryMeta[l.category].path}/${l.entry.id}`,
      group: categoryMeta[l.category].label,
      category: l.category,
    },
    title: l.entry.title.toLowerCase(),
    text: entrySearchText(l),
  }));
  const skills: Indexed[] = repository.getSkills().map((s: Skill) => ({
    hit: {
      kind: 'skill',
      key: `skill/${s.id}`,
      title: s.name,
      subtitle: s.category,
      href: `/skills?skill=${encodeURIComponent(s.id)}`,
      group: 'Skills',
    },
    title: s.name.toLowerCase(),
    text: `${s.name} ${s.category} ${s.description ?? ''}`.toLowerCase(),
  }));
  return [...entries, ...skills];
}

/** All tokens must match somewhere; title matches rank higher. */
export function search(query: string): SearchHit[] {
  const tokens = tokenize(query);
  if (!tokens.length) return [];
  index ??= buildIndex();
  const hits: SearchHit[] = [];
  for (const item of index) {
    if (!tokens.every((t) => item.text.includes(t) || item.title.includes(t))) continue;
    let score = 0;
    for (const t of tokens) {
      if (item.title.startsWith(t)) score += 6;
      else if (item.title.includes(t)) score += 4;
      else score += 1;
    }
    hits.push({ ...item.hit, score });
  }
  return hits.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
}

/** Group hits by their group label, preserving best-first order of groups. */
export function groupHits(hits: SearchHit[]): Array<{ group: string; hits: SearchHit[] }> {
  const groups = new Map<string, SearchHit[]>();
  hits.forEach((h) => {
    if (!groups.has(h.group)) groups.set(h.group, []);
    groups.get(h.group)!.push(h);
  });
  return [...groups.entries()].map(([group, list]) => ({ group, hits: list }));
}
