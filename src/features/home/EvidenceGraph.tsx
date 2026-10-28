import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoryMeta, categoryOrder } from '@/data/categories';
import { site } from '@/data/site';
import { cn } from '@/lib/cn';
import { repository } from '@/lib/repository';
import type { CategoryKey } from '@/types/content';

const shortLabel: Record<CategoryKey, string> = {
  courses: 'Courses',
  certifications: 'Certifications',
  projects: 'Projects',
  experience: 'Experience',
  competitions: 'Competitions',
  workshops: 'Workshops',
  programs: 'Programs',
  books: 'Books',
  volunteering: 'Volunteering',
  events: 'Events',
  labs: 'Labs',
};

const W = 680;
const H = 580;
const CX = W / 2;
const CY = 290;
const R = 172;

/**
 * The portfolio drawn as a network: one node per achievement category,
 * sized by its real entry count, with links wherever records in two
 * categories reference each other. Everything is derived from the data.
 */
export function EvidenceGraph({ className }: { className?: string }) {
  const navigate = useNavigate();
  const [hover, setHover] = useState<CategoryKey | null>(null);

  const { nodes, edges } = useMemo(() => {
    const counts = repository.getCounts();
    const nodes = categoryOrder.map((key, i) => {
      const angle = -Math.PI / 2 + (i / categoryOrder.length) * Math.PI * 2;
      const count = counts[key];
      return {
        key,
        count,
        x: CX + Math.cos(angle) * R,
        y: CY + Math.sin(angle) * R,
        angle,
        r: count ? Math.min(32, 9 + 5.2 * Math.sqrt(count)) : 6,
      };
    });
    const pairCount = new Map<string, number>();
    repository.getAll().forEach((l) =>
      (l.entry.related ?? []).forEach((ref) => {
        if (ref.category === l.category || !repository.resolve(ref)) return;
        const k = [l.category, ref.category].sort().join('|');
        pairCount.set(k, (pairCount.get(k) ?? 0) + 1);
      }),
    );
    const edges = [...pairCount.entries()].map(([k, n]) => {
      const [a, b] = k.split('|') as [CategoryKey, CategoryKey];
      return { a, b, n };
    });
    return { nodes, edges };
  }, []);

  const pos = (k: CategoryKey) => nodes.find((n) => n.key === k)!;
  const total = nodes.reduce((s, n) => s + n.count, 0);

  return (
    <figure className={cn('relative', className)}>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full overflow-visible" role="group" aria-label={`Portfolio map: ${total} entries across ${categoryOrder.length} categories`}>
        {/* Cross-references between categories */}
        <g fill="none" strokeLinecap="round">
          {edges.map((e, i) => {
            const a = pos(e.a);
            const b = pos(e.b);
            const lit = hover === e.a || hover === e.b;
            const len = Math.hypot(a.x - b.x, a.y - b.y);
            return (
              <path
                key={`${e.a}-${e.b}`}
                d={`M${a.x},${a.y} Q${CX},${CY} ${b.x},${b.y}`}
                className={cn('transition-[stroke-opacity] duration-300', lit ? 'stroke-accent' : 'stroke-muted')}
                strokeOpacity={hover ? (lit ? 0.9 : 0.12) : 0.35}
                strokeWidth={1 + Math.min(e.n, 4) * 0.5}
                style={{ strokeDasharray: len * 1.4, ['--len' as string]: len * 1.4, animation: `draw-link 1.1s ${0.5 + i * 0.05}s cubic-bezier(.4,0,.2,1) both` }}
              />
            );
          })}
        </g>

        {/* Spokes from the centre */}
        <g>
          {nodes.map((n, i) => (
            <line
              key={n.key}
              x1={CX}
              y1={CY}
              x2={n.x}
              y2={n.y}
              className="stroke-line"
              strokeWidth={1}
              strokeDasharray={n.count ? undefined : '3 5'}
              style={n.count ? { strokeDasharray: R, ['--len' as string]: R, animation: `draw-link .7s ${i * 0.04}s ease-out both` } : undefined}
            />
          ))}
        </g>

        {/* Centre */}
        <g style={{ transformOrigin: `${CX}px ${CY}px`, animation: 'node-in .5s ease-out both' }} aria-hidden="true">
          <circle cx={CX} cy={CY} r={44} className="fill-accent" />
          <text x={CX} y={CY + 9} textAnchor="middle" className="fill-accent-ink font-display" style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.04em' }}>
            {site.profile.monogram}
          </text>
        </g>

        {/* Category nodes */}
        {nodes.map((n, i) => {
          const cos = Math.cos(n.angle);
          const sin = Math.sin(n.angle);
          const side = Math.abs(cos) < 0.3 ? 'middle' : cos > 0 ? 'start' : 'end';
          const lx = n.x + cos * (n.r + 12);
          const ly = n.y + sin * (n.r + 12) + (side === 'middle' ? (sin < 0 ? -10 : 18) : 0);
          const dim = hover && hover !== n.key && !edges.some((e) => (e.a === hover && e.b === n.key) || (e.b === hover && e.a === n.key));
          const meta = categoryMeta[n.key];
          return (
            <a
              key={n.key}
              href={meta.path}
              onClick={(ev) => {
                ev.preventDefault();
                navigate(meta.path);
              }}
              onMouseEnter={() => setHover(n.key)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(n.key)}
              onBlur={() => setHover(null)}
              aria-label={`${meta.label}: ${n.count} ${n.count === 1 ? 'entry' : 'entries'}`}
              className="group cursor-pointer outline-none"
              style={{ opacity: dim ? 0.35 : 1, transition: 'opacity 300ms' }}
            >
              <g style={{ transformOrigin: `${n.x}px ${n.y}px`, animation: `node-in .5s ${0.25 + i * 0.05}s cubic-bezier(.3,1.4,.5,1) both` }}>
                <circle cx={n.x} cy={n.y} r={n.r + 8} className="fill-transparent stroke-accent opacity-0 group-focus-visible:opacity-100" strokeWidth={2} />
                {n.count ? (
                  <circle cx={n.x} cy={n.y} r={n.r} className={`fill-cat-${n.key} transition-transform`} fillOpacity={0.9} />
                ) : (
                  <circle cx={n.x} cy={n.y} r={n.r} className="fill-bg stroke-muted" strokeDasharray="2 3" strokeWidth={1.5} />
                )}
                {n.r >= 18 && (
                  <text x={n.x} y={n.y + 6} textAnchor="middle" className="fill-surface font-display" style={{ fontSize: 17, fontWeight: 650 }}>
                    {n.count}
                  </text>
                )}
                <text x={lx} y={ly + 5} textAnchor={side} className="fill-ink font-sans transition-colors group-hover:fill-accent" style={{ fontSize: 17, fontWeight: 500 }}>
                  {shortLabel[n.key]}
                  {n.r < 18 && <tspan className="fill-muted" dx={6}>{n.count}</tspan>}
                </text>
              </g>
            </a>
          );
        })}
      </svg>
      <figcaption className="sr-only">
        Each circle is an achievement category sized by how many entries it holds; curved lines connect categories whose entries reference each other.
      </figcaption>
    </figure>
  );
}
