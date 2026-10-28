import { ArrowUpRight, Download, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LinkButton } from '@/components/ui/Button';
import { SectionHeading } from '@/components/ui/PageHeader';
import { SmartImage } from '@/components/ui/SmartImage';
import { SocialLinks } from '@/components/ui/SocialLinks';
import { categoryMeta } from '@/data/categories';
import { site } from '@/data/site';
import { CategoryGlyph, EntryGrid } from '@/features/achievements/EntryCard';
import { EvidenceGraph } from '@/features/home/EvidenceGraph';
import { usePageMeta } from '@/hooks/usePageMeta';
import { entryDateLabel, primaryDateKey } from '@/lib/dates';
import { repository } from '@/lib/repository';

function useStats() {
  const counts = repository.getCounts();
  const all = repository.getAll();
  const total = all.length;
  const completedLabs = repository.getCollection('labs').filter((l) => l.status === 'completed').length;
  const evidenced = repository.getSkills().filter((s) => repository.getSkillEvidence(s.id).length > 0).length;
  const activeCategories = Object.values(counts).filter((n) => n > 0).length;
  return [
    { value: total, label: 'entries on record', to: '/achievements' },
    { value: completedLabs, label: 'labs completed', to: categoryMeta.labs.path },
    { value: evidenced, label: 'skills backed by evidence', to: '/skills' },
    { value: activeCategories, label: `of ${Object.keys(counts).length} categories in use`, to: '/achievements' },
  ];
}

export default function HomePage() {
  usePageMeta(undefined);
  const p = site.profile;
  const stats = useStats();
  const featured = repository.getFeatured();
  const recent = repository
    .getAll()
    .filter((l) => primaryDateKey(l.entry))
    .sort((a, b) => primaryDateKey(b.entry).localeCompare(primaryDateKey(a.entry)))
    .slice(0, 6);

  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div className="container-page grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[minmax(0,1fr),minmax(0,1.05fr)] lg:gap-6 lg:py-24">
          <div className="animate-rise">
            <div className="mb-6 flex items-center gap-4">
              {p.profileImage && <SmartImage src={p.profileImage} alt={`Portrait of ${p.fullName}`} className="h-16 w-16 rounded-2xl border border-line" />}
              <p className="text-sm text-muted">
                <span className="block font-medium text-ink">{p.academicStatus}</span>
                {p.degree}, {p.university}
              </p>
            </div>
            <h1 className="font-display text-display-xl">{p.fullName}</h1>
            <p className="mt-5 max-w-[30ch] font-display text-2xl leading-snug text-ink/85 sm:text-[1.7rem]">{p.headline}</p>
            <p className="mt-6 max-w-[56ch] text-lg leading-relaxed text-muted">{p.shortBio}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton to="/achievements" variant="primary">
                Explore achievements
              </LinkButton>
              <LinkButton to="/projects">View projects</LinkButton>
              <LinkButton to="/contact" variant="ghost">
                <Mail size={16} aria-hidden="true" /> Contact me
              </LinkButton>
              {p.cvPath && (
                <LinkButton to={p.cvPath} variant="ghost" download="">
                  <Download size={16} aria-hidden="true" /> Download CV
                </LinkButton>
              )}
            </div>
            <SocialLinks featuredOnly className="mt-8" />
          </div>
          <EvidenceGraph className="mx-auto w-full max-w-[640px]" />
        </div>
      </section>

      <section aria-label="Portfolio in numbers" className="border-b border-line bg-surface/50">
        <ul className="container-page grid grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <li key={s.label} className={`border-line py-6 ${i % 2 ? 'pl-6' : 'pr-6'} ${i % 2 ? 'border-l' : ''} lg:border-l lg:px-6 lg:first:border-l-0 lg:first:pl-0 ${i > 1 ? 'border-t lg:border-t-0' : ''}`}>
              <Link to={s.to} className="group block">
                <span className="block font-display text-4xl font-semibold tabular-nums tracking-tight">{s.value}</span>
                <span className="mt-1 block text-sm text-muted group-hover:text-ink">{s.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {featured.length > 0 && (
        <section className="container-page py-16" aria-labelledby="featured-heading">
          <SectionHeading id="featured-heading" title="Featured work" lead="A few entries worth starting with." action={<LinkButton to="/projects" variant="ghost">All projects</LinkButton>} />
          <EntryGrid items={featured} showCategory />
        </section>
      )}

      <section className="border-t border-line" aria-labelledby="recent-heading">
        <div className="container-page grid gap-10 py-16 lg:grid-cols-[18rem,1fr]">
          <div>
            <h2 id="recent-heading" className="font-display text-display-md">
              Most recent
            </h2>
            <p className="mt-3 text-muted">The latest dated entries across every category.</p>
            <LinkButton to="/journey" className="mt-6">
              See the full journey
            </LinkButton>
          </div>
          {recent.length ? (
            <ol className="divide-y divide-line border-y border-line">
              {recent.map((l) => (
                <li key={`${l.category}/${l.entry.id}`}>
                  <Link to={`${categoryMeta[l.category].path}/${l.entry.id}`} className="group grid grid-cols-[auto,1fr] items-baseline gap-x-4 gap-y-1 py-4 sm:grid-cols-[7.5rem,auto,1fr,auto]">
                    <span className="col-span-2 text-sm tabular-nums text-muted sm:col-span-1">{entryDateLabel(l.entry)}</span>
                    <CategoryGlyph category={l.category} className="translate-y-0.5" />
                    <span className="min-w-0">
                      <span className="font-medium group-hover:text-accent">{l.entry.title}</span>
                      <span className="ml-2 text-sm text-muted">{categoryMeta[l.category].singular}</span>
                      {l.entry.sample && <span className="ml-2 text-xs text-cat-certifications">Sample</span>}
                    </span>
                    <ArrowUpRight size={16} aria-hidden="true" className="hidden text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent sm:block" />
                  </Link>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-muted">Add dates to your entries to see them here.</p>
          )}
        </div>
      </section>
    </>
  );
}
