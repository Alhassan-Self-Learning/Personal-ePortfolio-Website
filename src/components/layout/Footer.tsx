import { Link } from 'react-router-dom';
import { SocialLinks } from '@/components/ui/SocialLinks';
import { site } from '@/data/site';

/** A single quiet line: what this is, a few links, the year. */
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto pt-[18vh]">
      <div className="container-page grid gap-3 pb-8 text-sm md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-6">
        <p className="text-muted">{site.profile.fullName}, cybersecurity ePortfolio</p>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {[
              { label: 'Achievements', to: '/achievements' },
              { label: 'Skills', to: '/skills' },
              { label: 'Journey', to: '/journey' },
              { label: 'Contact', to: '/contact' },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-ink hover:text-accent">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-4 md:justify-end">
          <SocialLinks variant="icons" />
          <p className="text-muted">© {year}</p>
        </div>
      </div>
    </footer>
  );
}
