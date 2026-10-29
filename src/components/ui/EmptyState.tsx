import type { ReactNode } from 'react';

export function EmptyState({ icon, title, children, action, as: H = 'h3' }: { icon?: ReactNode; title: string; children?: ReactNode; action?: ReactNode; as?: 'h1' | 'h2' | 'h3' }) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed border-line px-6 py-10 sm:items-center sm:text-center">
      {icon && <div className="text-muted">{icon}</div>}
      <H className="font-display text-lg font-semibold">{title}</H>
      {children && <div className="max-w-md text-sm text-muted">{children}</div>}
      {action}
    </div>
  );
}
