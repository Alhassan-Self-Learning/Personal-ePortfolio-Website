import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export interface Crumb {
  label: string;
  to?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((c, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true">/</span>}
            {c.to ? (
              <Link to={c.to} className="text-ink underline decoration-1 underline-offset-4 hover:text-accent">
                {c.label}
              </Link>
            ) : (
              <span aria-current="page">{c.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Page opening: title on the anchor line, the lead beside or beneath it. */
export function PageHeader({ title, lead, crumbs, aside, children }: { title: ReactNode; lead?: ReactNode; crumbs?: Crumb[]; aside?: ReactNode; children?: ReactNode }) {
  return (
    <header className="reveal pb-14 pt-14 sm:pt-20">
      {crumbs && <Breadcrumbs items={crumbs} />}
      <h1 className="max-w-[22ch] text-display-lg text-ink">{title}</h1>
      <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        {lead && <p className="max-w-[56ch] text-xl text-ink">{lead}</p>}
        {aside}
      </div>
      {children}
    </header>
  );
}

export function SectionHeading({ title, lead, action, id }: { title: string; lead?: ReactNode; action?: ReactNode; id?: string }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 id={id} className="text-display-md">
          {title}
        </h2>
        {lead && <p className="mt-3 max-w-[56ch] text-base text-ink">{lead}</p>}
      </div>
      {action}
    </div>
  );
}
