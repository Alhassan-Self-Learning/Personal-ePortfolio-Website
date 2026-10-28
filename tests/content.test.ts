import { describe, expect, it } from 'vitest';
import { rawCollections } from '@/data/achievements';
import { categoryMeta, categoryOrder } from '@/data/categories';
import { site } from '@/data/site';
import { skills } from '@/data/skills';
import { dateKey, entryDateLabel, formatDate, isPast, parsePartialDate, primaryDateKey } from '@/lib/dates';
import { repository } from '@/lib/repository';
import { search } from '@/lib/search';
import { resolveSocial } from '@/lib/social';
import { sortEntries } from '@/lib/sort';
import type { AnyEntry } from '@/types/content';

const allRaw = categoryOrder.flatMap((c) => (rawCollections[c] as AnyEntry[]).map((entry) => ({ category: c, entry })));

describe('content integrity', () => {
  it('defines all eleven categories with unique paths', () => {
    expect(categoryOrder).toHaveLength(11);
    const paths = categoryOrder.map((c) => categoryMeta[c].path);
    expect(new Set(paths).size).toBe(11);
  });

  it('uses unique ids within each category', () => {
    for (const c of categoryOrder) {
      const ids = (rawCollections[c] as AnyEntry[]).map((e) => e.id);
      expect(new Set(ids).size, c).toBe(ids.length);
      ids.forEach((id) => expect(id, `${c}/${id}`).toMatch(/^[a-z0-9-]+$/));
    }
  });

  it('only references entries that exist', () => {
    for (const { category, entry } of allRaw) {
      for (const ref of entry.related ?? []) {
        const target = (rawCollections[ref.category] as AnyEntry[]).find((e) => e.id === ref.id);
        expect(target, `${category}/${entry.id} → ${ref.category}/${ref.id}`).toBeDefined();
      }
    }
  });

  it('only references skills that exist', () => {
    const ids = new Set(skills.map((s) => s.id));
    expect(ids.size).toBe(skills.length);
    for (const { category, entry } of allRaw) for (const s of entry.skills ?? []) expect(ids.has(s), `${category}/${entry.id} skill ${s}`).toBe(true);
  });

  it('uses valid partial dates', () => {
    for (const { category, entry } of allRaw) {
      for (const d of [entry.date, entry.startDate, entry.endDate]) if (d) expect(parsePartialDate(d), `${category}/${entry.id} ${d}`).not.toBeNull();
    }
  });

  it('features only existing records', () => {
    for (const ref of site.featured) expect((rawCollections[ref.category] as AnyEntry[]).some((e) => e.id === ref.id), `${ref.category}/${ref.id}`).toBe(true);
  });
});

describe('repository', () => {
  it('counts match the collections', () => {
    const counts = repository.getCounts();
    for (const c of categoryOrder) expect(counts[c]).toBe(repository.getCollection(c).length);
    expect(Object.values(counts).reduce((a, b) => a + b, 0)).toBe(repository.getAll().length);
  });

  it('finds related entries in both directions', () => {
    const lab = repository.getEntry('labs', 'thm-pentesting-fundamentals')!;
    const related = repository.getRelated('labs', lab);
    // The project links to this lab, so the lab must list the project as related.
    expect(related.some((l) => l.category === 'projects' && l.entry.id === 'ethical-hacking-assessment')).toBe(true);
    expect(related.some((l) => l.entry.id === lab.id)).toBe(false);
  });

  it('builds skill evidence from entry skill ids', () => {
    const evidence = repository.getSkillEvidence('linux');
    expect(evidence.length).toBeGreaterThan(0);
    evidence.forEach((l) => expect(l.entry.skills).toContain('linux'));
  });
});

describe('dates', () => {
  it('formats partial dates', () => {
    expect(formatDate('2026')).toBe('2026');
    expect(formatDate('2026-03')).toBe('Mar 2026');
    expect(formatDate('2026-05-14')).toBe('14 May 2026');
    expect(formatDate(undefined)).toBe('');
    expect(dateKey('2026-03')).toBe('2026-03-00');
  });

  it('labels ranges and ongoing entries', () => {
    expect(entryDateLabel({ id: 'a', title: 'a', summary: '', startDate: '2026-01', endDate: '2026-03' })).toBe('Jan 2026 – Mar 2026');
    expect(entryDateLabel({ id: 'a', title: 'a', summary: '', startDate: '2026-01', current: true })).toBe('Jan 2026 – present');
    expect(entryDateLabel({ id: 'a', title: 'a', summary: '' })).toBe('');
  });

  it('treats month-precision expiry as the end of that month', () => {
    expect(isPast('2026-03', new Date('2026-03-20T00:00:00Z'))).toBe(false);
    expect(isPast('2026-03', new Date('2026-04-01T12:00:00Z'))).toBe(true);
  });
});

describe('sorting', () => {
  const mk = (id: string, date?: string): AnyEntry => ({ id, title: id, summary: '', date, provider: 'x', status: 'completed' }) as AnyEntry;
  const list = [mk('b', '2025-01'), mk('a'), mk('c', '2026-06')];

  it('sorts newest and oldest with undated last', () => {
    expect(sortEntries(list, 'newest', 'courses').map((e) => e.id)).toEqual(['c', 'b', 'a']);
    expect(sortEntries(list, 'oldest', 'courses').map((e) => e.id)).toEqual(['b', 'c', 'a']);
  });

  it('sorts alphabetically', () => {
    expect(sortEntries(list, 'alpha', 'courses').map((e) => e.id)).toEqual(['a', 'b', 'c']);
  });

  it('puts featured entries first', () => {
    const labs = repository.getCollection('labs');
    const sorted = sortEntries(labs, 'featured', 'labs');
    expect(repository.isFeatured('labs', sorted[0].id)).toBe(true);
  });

  it('places current entries at today', () => {
    expect(primaryDateKey({ id: 'x', title: 'x', summary: '', startDate: '2020-01', current: true }, new Date('2026-10-29'))).toBe('2026-10-29');
  });
});

describe('search', () => {
  it('matches titles, providers and skills across categories', () => {
    expect(search('corridor')[0]?.href).toBe('/achievements/labs/thm-corridor');
    expect(search('tryhackme').filter((h) => h.category === 'labs').length).toBeGreaterThan(5);
    expect(search('linux').some((h) => h.kind === 'skill')).toBe(true);
  });

  it('requires every word to match', () => {
    expect(search('corridor windows')).toHaveLength(0);
    expect(search('')).toHaveLength(0);
  });
});

describe('social links', () => {
  it('hides profiles without a usable destination', () => {
    expect(resolveSocial({ id: 'a', platform: 'github', url: '', order: 1, visible: true })).toBeNull();
    expect(resolveSocial({ id: 'a', platform: 'github', url: 'https://github.com/me', order: 1, visible: false })).toBeNull();
    expect(resolveSocial({ id: 'a', platform: 'github', url: 'https://github.com/me', order: 1, visible: true })?.href).toBe('https://github.com/me');
  });

  it('builds WhatsApp links without exposing the number by default', () => {
    const w = resolveSocial({ id: 'w', platform: 'whatsapp', phone: '+968 9000 0000', order: 1, visible: true })!;
    expect(w.href).toBe('https://wa.me/96890000000');
    expect(w.display).not.toContain('9000');
    const shown = resolveSocial({ id: 'w', platform: 'whatsapp', phone: '96890000000', showPhone: true, order: 1, visible: true })!;
    expect(shown.display).toBe('+96890000000');
  });

  it('validates email addresses', () => {
    expect(resolveSocial({ id: 'e', platform: 'email', username: 'not-an-email', order: 1, visible: true })).toBeNull();
    expect(resolveSocial({ id: 'e', platform: 'email', username: 'me@example.com', order: 1, visible: true })?.href).toBe('mailto:me@example.com');
  });
});
