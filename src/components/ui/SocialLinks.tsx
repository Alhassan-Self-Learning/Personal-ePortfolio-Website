import { getSocialLinks } from '@/lib/social';
import { cn } from '@/lib/cn';
import { SocialIcon } from './SocialIcon';

/** Renders only configured, valid profiles. Renders nothing when none are set up. */
export function SocialLinks({ featuredOnly, variant = 'icons', className }: { featuredOnly?: boolean; variant?: 'icons' | 'list'; className?: string }) {
  const links = getSocialLinks({ featuredOnly });
  if (!links.length) return null;

  if (variant === 'list') {
    return (
      <ul className={cn('flex flex-col gap-1', className)}>
        {links.map((s) => (
          <li key={s.id}>
            <a
              href={s.href}
              {...(s.external ? { target: '_blank', rel: 'noopener noreferrer me' } : {})}
              className="flex items-center gap-4 bg-surface px-4 py-3.5 transition-colors hover:bg-sunken"
            >
              <span className="flex h-9 w-9 items-center justify-center text-ink">
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
            className="inline-flex h-11 w-11 items-center justify-center bg-surface text-ink transition-colors hover:bg-accent hover:text-accent-ink"
          >
            <SocialIcon platform={s.platform} />
          </a>
        </li>
      ))}
    </ul>
  );
}
