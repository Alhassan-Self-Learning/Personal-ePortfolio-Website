import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export interface Crumb {
  label: string;
  to?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-5 text-sm text-muted">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((c, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true" className="text-line">/</span>}
            {c.to ? (
              <Link to={c.to} className="hover:text-ink">
                {c.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-ink/80">
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHeader({ title, lead, crumbs, aside, children }: { title: ReactNode; lead?: ReactNode; crumbs?: Crumb[]; aside?: ReactNode; children?: ReactNode }) {
  return (
    <header className="border-b border-line pb-8 pt-10 sm:pt-14">
      {crumbs && <Breadcrumbs items={crumbs} />}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <h1 className="font-display text-display-lg text-ink">{title}</h1>
          {lead && <p className="mt-4 max-w-[62ch] text-lg leading-relaxed text-muted">{lead}</p>}
        </div>
        {aside}
      </div>
      {children}
    </header>
  );
}

export function SectionHeading({ title, lead, action, id }: { title: string; lead?: ReactNode; action?: ReactNode; id?: string }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 id={id} className="font-display text-display-md">{title}</h2>
        {lead && <p className="mt-2 max-w-[62ch] text-muted">{lead}</p>}
      </div>
      {action}
    </div>
  );
}
