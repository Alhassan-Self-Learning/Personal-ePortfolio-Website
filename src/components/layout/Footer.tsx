import { Link } from 'react-router-dom';
import { Monogram } from '@/components/ui/Monogram';
import { SocialLinks } from '@/components/ui/SocialLinks';
import { categoryMeta, categoryOrder } from '@/data/categories';
import { navigation } from '@/data/navigation';
import { site } from '@/data/site';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t border-line bg-surface/60">
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1.4fr,1fr,1.4fr]">
        <div className="max-w-sm">
          <div className="flex items-center gap-3">
            <Monogram size={32} />
            <span className="font-display text-lg font-semibold">{site.profile.fullName}</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted">{site.profile.headline}.</p>
          <SocialLinks className="mt-5" variant="icons" />
        </div>
        <nav aria-label="Footer">
          <h2 className="mb-3 text-sm font-semibold">Pages</h2>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm md:grid-cols-1">
            {navigation.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="text-muted hover:text-ink">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Achievement categories">
          <h2 className="mb-3 text-sm font-semibold">Achievements</h2>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {categoryOrder.map((k) => (
              <li key={k}>
                <Link to={categoryMeta[k].path} className="text-muted hover:text-ink">
                  {categoryMeta[k].label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-line">
        <p className="container-page py-5 text-xs text-muted">
          © {year} {site.profile.fullName}. Every entry on this site links to its own evidence.
        </p>
      </div>
    </footer>
  );
}
