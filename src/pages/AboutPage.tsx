import { Download, GraduationCap, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LinkButton } from '@/components/ui/Button';
import { PageHeader, SectionHeading } from '@/components/ui/PageHeader';
import { categoryMeta } from '@/data/categories';
import { site } from '@/data/site';
import { usePageMeta } from '@/hooks/usePageMeta';
import { plural } from '@/lib/cn';
import { repository } from '@/lib/repository';

export default function AboutPage() {
  const p = site.profile;
  usePageMeta('About', p.shortBio);

  // "Where I practise" is derived from the labs data, not typed by hand.
  const platforms = new Map<string, number>();
  repository.getCollection('labs').forEach((l) => platforms.set(l.platform, (platforms.get(l.platform) ?? 0) + 1));

  return (
    <div className="container-page pb-20">
      <PageHeader title="About me" lead={p.headline + '.'} />

      <div className="grid gap-12 py-12 lg:grid-cols-[minmax(0,1fr),20rem]">
        <div className="prose-body">
          {p.longBio.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
        <aside className="space-y-6">
          <dl className="divide-y divide-line rounded-xl border border-line bg-surface text-sm">
            <div className="flex gap-3 p-4">
              <GraduationCap size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-accent" />
              <div>
                <dt className="sr-only">Education</dt>
                <dd>
                  <span className="block font-medium">{p.degree}</span>
                  <span className="text-muted">{p.university}</span>
                  <span className="block text-muted">{p.academicStatus}</span>
                </dd>
              </div>
            </div>
            {p.location && (
              <div className="flex gap-3 p-4">
                <MapPin size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-accent" />
                <div>
                  <dt className="sr-only">Location</dt>
                  <dd>{p.location}</dd>
                </div>
              </div>
            )}
          </dl>
          {p.cvPath && (
            <LinkButton to={p.cvPath} download="" variant="primary" className="w-full">
              <Download size={16} aria-hidden="true" /> Download CV
            </LinkButton>
          )}
        </aside>
      </div>

      <section className="border-t border-line py-12" aria-labelledby="path-heading">
        <SectionHeading id="path-heading" title="Where I'm heading" />
        <ol className="grid gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-3">
          {site.path.map((step, i) => (
            <li key={step.title} className="relative bg-surface p-6">
              <p className="flex items-center gap-2 text-sm text-muted">
                <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${i === 0 ? 'bg-accent text-accent-ink' : 'border border-line'}`}>{i + 1}</span>
                {step.label}
              </p>
              <p className="mt-3 font-display text-xl font-semibold">{step.title}</p>
              <p className="mt-1 text-sm text-muted">{step.detail}</p>
            </li>
          ))}
        </ol>
      </section>

      <div className="grid gap-12 border-t border-line py-12 md:grid-cols-2">
        <section aria-labelledby="interests-heading">
          <h2 id="interests-heading" className="mb-4 font-display text-display-md">
            Interests
          </h2>
          <ul className="space-y-2 text-lg">
            {p.careerInterests.map((c) => (
              <li key={c} className="flex gap-3">
                <span aria-hidden="true" className="mt-[0.65em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {c}
              </li>
            ))}
          </ul>
        </section>
        {platforms.size > 0 && (
          <section aria-labelledby="practice-heading">
            <h2 id="practice-heading" className="mb-4 font-display text-display-md">
              Where I practise
            </h2>
            <ul className="divide-y divide-line border-y border-line">
              {[...platforms.entries()]
                .sort((a, b) => b[1] - a[1])
                .map(([name, n]) => (
                  <li key={name}>
                    <Link to={`${categoryMeta.labs.path}?platform=${encodeURIComponent(name)}`} className="flex items-center justify-between py-3 hover:text-accent">
                      <span>{name}</span>
                      <span className="text-sm text-muted">{plural(n, 'lab')}</span>
                    </Link>
                  </li>
                ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
