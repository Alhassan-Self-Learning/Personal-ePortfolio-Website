import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type Tone = 'neutral' | 'accent' | 'positive' | 'progress' | 'planned' | 'warning';

const dots: Record<Tone, string> = {
  neutral: 'bg-muted',
  accent: 'bg-accent',
  positive: 'bg-cat-labs',
  progress: 'bg-cat-courses',
  planned: 'bg-transparent ring-[1.5px] ring-inset ring-muted',
  warning: 'bg-cat-competitions',
};

/** A status: a coloured dot and plain words. No box. */
export function Badge({ tone = 'neutral', dot = true, children, className }: { tone?: Tone; dot?: boolean; children: ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2 whitespace-nowrap text-sm text-ink', className)}>
      {dot && <span aria-hidden="true" className={cn('h-2 w-2 shrink-0 rounded-full', dots[tone])} />}
      {children}
    </span>
  );
}

export function SampleBadge({ className }: { className?: string }) {
  return (
    <span
      title="Demonstration content — replace it with your own"
      className={cn('inline-flex items-center bg-cat-certifications/10 px-1.5 text-xs font-medium text-cat-certifications', className)}
    >
      Sample
    </span>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return <span className="inline-flex bg-surface px-2 py-0.5 text-sm text-ink">{children}</span>;
}
