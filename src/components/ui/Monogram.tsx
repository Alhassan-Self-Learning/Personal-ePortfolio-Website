import { site } from '@/data/site';
import { cn } from '@/lib/cn';

/** The personal mark: initials with a single linked node. */
export function Monogram({ className, size = 36 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} aria-hidden="true" className={cn('shrink-0', className)}>
      <rect x="0.5" y="0.5" width="39" height="39" rx="10" className="fill-accent" />
      <path d="M31 9 L24 16" className="stroke-accent-soft" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="31" cy="9" r="2.6" className="fill-accent-soft" />
      <text
        x="18"
        y="27.5"
        textAnchor="middle"
        className="fill-accent-ink font-display"
        style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.04em' }}
      >
        {site.profile.monogram}
      </text>
    </svg>
  );
}
