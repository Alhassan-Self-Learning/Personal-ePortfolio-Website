import { site } from '@/data/site';
import { cn } from '@/lib/cn';

/** The personal mark: initials with a single linked node. */
export function Monogram({ className, size = 36 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} aria-hidden="true" className={cn('shrink-0', className)}>
      <rect width="40" height="40" className="fill-field" />
            <text
        x="20"
        y="27"
        textAnchor="middle"
        className="fill-field-ink"
        style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}
      >
        {site.profile.monogram}
      </text>
    </svg>
  );
}
