import { getSocialLinks } from '@/lib/social';
import { cn } from '@/lib/cn';
import { SocialIcon } from './SocialIcon';

/** Renders only configured, valid profiles. Renders nothing when none are set up. */
export function SocialLinks({ featuredOnly, variant = 'icons', className }: { featuredOnly?: boolean; variant?: 'icons' | 'list'; className?: string }) {
  const links = getSocialLinks({ featuredOnly });
  if (!links.length) return null;

  if (variant === 'list') {
    return (
      <ul className={cn('divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface', className)}>
        {links.map((s) => (
          <li key={s.id}>
            <a
              href={s.href}
              {...(s.external ? { target: '_blank', rel: 'noopener noreferrer me' } : {})}
              className="flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-sunken/60"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sunken text-ink">
                <SocialIcon platform={s.platform} />
              </span>
              <span className="min-w-0">
                <span className="block font-medium">{s.label}</span>
                <span className="block truncate text-sm text-muted">{s.display}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className={cn('flex flex-wrap gap-1', className)}>
      {links.map((s) => (
        <li key={s.id}>
          <a
            href={s.href}
            aria-label={s.platform === 'email' ? `Email ${s.display}` : `${s.label}${s.external ? ' (opens in a new tab)' : ''}`}
            title={s.label}
            {...(s.external ? { target: '_blank', rel: 'noopener noreferrer me' } : {})}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-surface text-muted transition-colors hover:border-muted/60 hover:text-ink"
          >
            <SocialIcon platform={s.platform} />
          </a>
        </li>
      ))}
    </ul>
  );
}
