import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Tag } from '@/components/ui/Badge';
import { repository } from '@/lib/repository';

export function DetailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-line pt-6">
      <h2 className="mb-3 font-display text-xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}

export function Paragraphs({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <div className="prose-body">
      {text.split(/\n\s*\n/).map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}

export function BulletList({ items }: { items?: string[] }) {
  if (!items?.length) return null;
  return (
    <ul className="max-w-[68ch] space-y-2 text-[1.0625rem] leading-relaxed">
      {items.map((t, i) => (
        <li key={i} className="flex gap-3">
          <span aria-hidden="true" className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

export function Steps({ items }: { items?: string[] }) {
  if (!items?.length) return null;
  return (
    <ol className="max-w-[68ch] space-y-3">
      {items.map((t, i) => (
        <li key={i} className="flex gap-4">
          <span aria-hidden="true" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line text-sm font-medium text-muted">
            {i + 1}
          </span>
          <span className="pt-0.5 leading-relaxed">{t}</span>
        </li>
      ))}
    </ol>
  );
}

export function Chips({ items }: { items?: string[] }) {
  if (!items?.length) return null;
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((t) => (
        <li key={t}>
          <Tag>{t}</Tag>
        </li>
      ))}
    </ul>
  );
}

/** Skill chips that link to the skill on the Skills page. */
export function SkillLinks({ ids }: { ids?: string[] }) {
  const skills = (ids ?? []).map((id) => repository.getSkill(id)).filter(Boolean);
  if (!skills.length) return null;
  return (
    <ul className="flex flex-wrap gap-2">
      {skills.map((s) => (
        <li key={s!.id}>
          <Link
            to={`/skills?skill=${s!.id}`}
            className="inline-flex rounded-md border border-line px-2 py-1 text-sm transition-colors hover:border-accent hover:text-accent"
          >
            {s!.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Two-column block used for "problem → result" style content. */
export function Pair({ left, right }: { left: { title: string; body: ReactNode }; right: { title: string; body: ReactNode } }) {
  return (
    <div className="grid gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-2">
      {[left, right].map((b) => (
        <div key={b.title} className="bg-surface p-5">
          <h3 className="mb-2 text-sm font-semibold text-muted">{b.title}</h3>
          <div className="leading-relaxed">{b.body}</div>
        </div>
      ))}
    </div>
  );
}
