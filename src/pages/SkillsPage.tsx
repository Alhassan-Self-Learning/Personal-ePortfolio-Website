import { ChevronDown, SearchX } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { SampleBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { SearchField, SelectField } from '@/components/ui/Field';
import { PageHeader } from '@/components/ui/PageHeader';
import { categoryMeta } from '@/data/categories';
import { CategoryGlyph } from '@/features/achievements/EntryCard';
import { usePageMeta } from '@/hooks/usePageMeta';
import { cn, plural } from '@/lib/cn';
import { repository } from '@/lib/repository';
import type { Skill } from '@/types/content';

function SkillRow({ skill, open }: { skill: Skill; open: boolean }) {
  const evidence = repository.getSkillEvidence(skill.id);
  return (
    <details id={`skill-${skill.id}`} open={open} className="group scroll-mt-40 border-b border-line last:border-b-0">
      <summary className="flex cursor-pointer list-none items-center gap-4 px-4 py-3.5 hover:bg-sunken/50 [&::-webkit-details-marker]:hidden">
        <span className="min-w-0 flex-1">
          <span className="font-medium">{skill.name}</span>
          {skill.sample && <SampleBadge className="ml-2" />}
          {skill.description && <span className="mt-0.5 block text-sm text-muted">{skill.description}</span>}
        </span>
        <span className={cn('shrink-0 text-sm', evidence.length ? 'text-ink' : 'text-muted')}>{evidence.length ? plural(evidence.length, 'piece of evidence', 'pieces of evidence') : 'No linked evidence yet'}</span>
        <ChevronDown size={16} aria-hidden="true" className="shrink-0 text-muted transition-transform group-open:rotate-180" />
      </summary>
      <div className="px-4 pb-4">
        {evidence.length ? (
          <ul className="grid gap-1 sm:grid-cols-2">
            {evidence.map((l) => (
              <li key={`${l.category}/${l.entry.id}`}>
                <Link to={`${categoryMeta[l.category].path}/${l.entry.id}`} className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-sunken">
                  <CategoryGlyph category={l.category} size={14} />
                  <span className="truncate">{l.entry.title}</span>
                  <span className="ml-auto shrink-0 text-xs text-muted">{categoryMeta[l.category].singular}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted">Link this skill from a course, lab, project or certification by adding its id ({skill.id}) to that entry's skills.</p>
        )}
      </div>
    </details>
  );
}

export default function SkillsPage() {
  usePageMeta('Skills & Technologies', 'Skills grouped by area, each linked to the labs, courses and projects that back it up.');
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const cat = params.get('category') ?? '';
  const evidencedOnly = params.get('evidence') === '1';
  const focus = params.get('skill');

  const set = (k: string, v: string) => {
    const next = new URLSearchParams(params);
    if (v) next.set(k, v);
    else next.delete(k);
    next.delete('skill');
    setParams(next, { replace: true });
  };

  const all = repository.getSkills();
  const cats = repository.getSkillCategories();
  const filtered = useMemo(() => {
    const t = q.toLowerCase().trim();
    return all.filter(
      (s) =>
        (!cat || s.category === cat) &&
        (!evidencedOnly || repository.getSkillEvidence(s.id).length > 0) &&
        (!t || `${s.name} ${s.description ?? ''} ${s.category}`.toLowerCase().includes(t)),
    );
  }, [all, q, cat, evidencedOnly]);

  useEffect(() => {
    if (focus) document.getElementById(`skill-${focus}`)?.scrollIntoView({ block: 'center' });
  }, [focus]);

  const grouped = cats.map((c) => ({ c, skills: filtered.filter((s) => s.category === c) })).filter((g) => g.skills.length);

  return (
    <div className="container-page pb-20">
      <PageHeader
        title="Skills & Technologies"
        lead="No percentages. Each skill links to the labs, courses and projects where I actually used it."
        aside={<p className="shrink-0 text-sm text-muted">{plural(all.length, 'skill')}</p>}
      />
      <div className="flex flex-col gap-3 py-6 sm:flex-row sm:items-end">
        <div className="flex flex-1 flex-col gap-1">
          <span aria-hidden="true" className="text-xs font-medium text-muted">
            Search
          </span>
          <SearchField value={q} onChange={(v) => set('q', v)} label="Search skills" placeholder="Search skills" />
        </div>
        <SelectField label="Area" value={cat} onChange={(v) => set('category', v)} className="sm:w-64">
          <option value="">All areas</option>
          {cats.map((c) => (
            <option key={c} value={c} disabled={!all.some((s) => s.category === c)}>
              {c}
            </option>
          ))}
        </SelectField>
        <label className="flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-line bg-surface px-3 text-sm">
          <input type="checkbox" checked={evidencedOnly} onChange={(e) => set('evidence', e.target.checked ? '1' : '')} className="h-4 w-4 accent-[rgb(var(--accent))]" />
          With evidence only
        </label>
      </div>

      {grouped.length === 0 ? (
        <EmptyState icon={<SearchX size={28} />} title="No skills match" action={<Button onClick={() => setParams({}, { replace: true })}>Clear filters</Button>}>
          Try a different search term or area.
        </EmptyState>
      ) : (
        <div className="space-y-10">
          {grouped.map((g) => (
            <section key={g.c} aria-labelledby={`area-${g.c}`}>
              <h2 id={`area-${g.c}`} className="mb-3 font-display text-xl font-semibold">
                {g.c}
              </h2>
              <div className="overflow-hidden rounded-xl border border-line bg-surface">
                {g.skills.map((s) => (
                  <SkillRow key={s.id} skill={s} open={focus === s.id} />
                ))}
              </div>
            </section>
          ))}
          {!cat && !q && (
            <p className="text-sm text-muted">
              Areas with nothing listed yet: {cats.filter((c) => !all.some((s) => s.category === c)).join(', ') || 'none'}.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
