import type { ReactNode } from 'react';

export function EmptyState({ icon, title, children, action, as: H = 'h3' }: { icon?: ReactNode; title: string; children?: ReactNode; action?: ReactNode; as?: 'h1' | 'h2' | 'h3' }) {
  return (
    <div className="flex flex-col items-start gap-3 bg-surface px-6 py-10 sm:px-10">
      {icon && <div className="text-muted">{icon}</div>}
      <H className="text-xl font-medium">{title}</H>
      {children && <div className="max-w-[52ch] text-base text-ink">{children}</div>}
      {action}
    </div>
  );
}
