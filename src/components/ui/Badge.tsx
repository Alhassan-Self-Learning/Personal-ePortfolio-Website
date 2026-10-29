import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type Tone = 'neutral' | 'accent' | 'positive' | 'progress' | 'planned' | 'warning';

const tones: Record<Tone, string> = {
  neutral: 'border-line text-muted',
  accent: 'border-accent/40 bg-accent/10 text-accent',
  positive: 'border-cat-labs/40 bg-cat-labs/10 text-cat-labs',
  progress: 'border-cat-courses/40 bg-cat-courses/10 text-cat-courses',
  planned: 'border-line border-dashed text-muted',
  warning: 'border-cat-competitions/40 bg-cat-competitions/10 text-cat-competitions',
};

const dots: Record<Tone, string> = {
  neutral: 'bg-muted',
  accent: 'bg-accent',
  positive: 'bg-cat-labs',
  progress: 'bg-cat-courses',
  planned: 'border border-muted',
  warning: 'bg-cat-competitions',
};

export function Badge({ tone = 'neutral', dot, children, className }: { tone?: Tone; dot?: boolean; children: ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-medium', tones[tone], className)}>
      {dot && <span aria-hidden="true" className={cn('h-1.5 w-1.5 rounded-full', dots[tone])} />}
      {children}
    </span>
  );
}

export function SampleBadge({ className }: { className?: string }) {
  return (
    <span
      title="Demonstration content — replace it with your own"
      className={cn('inline-flex items-center rounded-md border border-dashed border-cat-certifications/60 px-1.5 py-0.5 text-[0.7rem] font-medium text-cat-certifications', className)}
    >
      Sample
    </span>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return <span className="inline-flex rounded-md bg-sunken px-2 py-0.5 text-xs text-muted">{children}</span>;
}
