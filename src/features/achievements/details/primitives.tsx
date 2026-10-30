import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Tag } from '@/components/ui/Badge';
import { repository } from '@/lib/repository';

export function DetailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="reveal pt-6">
      <h2 className="mb-4 text-xl font-medium">{title}</h2>
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
    <ul className="max-w-[64ch] space-y-2 text-base">
      {items.map((t, i) => (
        <li key={i} className="flex gap-3">
          <span aria-hidden="true" className="mt-[0.65em] h-1.5 w-1.5 shrink-0 rounded-full bg-ink" />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

export function Steps({ items }: { items?: string[] }) {
  if (!items?.length) return null;
  return (
    <ol className="max-w-[64ch] list-decimal space-y-2 pl-5 text-base marker:text-muted">
      {items.map((t, i) => (
        <li key={i} className="pl-2">
          {t}
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
            className="inline-flex bg-surface px-2.5 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-ink"
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
    <div className="reveal grid gap-3 md:grid-cols-2">
      {[left, right].map((b) => (
        <div key={b.title} className="bg-surface p-6">
          <h3 className="mb-2 text-xl font-medium">{b.title}</h3>
          <div className="leading-relaxed">{b.body}</div>
        </div>
      ))}
    </div>
  );
}
