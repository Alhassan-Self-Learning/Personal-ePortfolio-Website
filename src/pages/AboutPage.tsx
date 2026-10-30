import { Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LinkButton } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { categoryMeta } from '@/data/categories';
import { site } from '@/data/site';
import { usePageMeta } from '@/hooks/usePageMeta';
import { cn, plural } from '@/lib/cn';
import { publicUrl } from '@/lib/paths';
import { repository } from '@/lib/repository';

export default function AboutPage() {
  const p = site.profile;
  usePageMeta('About', p.shortBio);

  // "Where I practise" is derived from the labs data, not typed by hand.
  const platforms = new Map<string, number>();
  repository.getCollection('labs').forEach((l) => platforms.set(l.platform, (platforms.get(l.platform) ?? 0) + 1));

  return (
    <div className="container-page">
      <PageHeader title="About me" lead={`${p.headline}.`} />

      <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-6">
        <div className="reveal prose-body lg:col-span-6">
          {p.longBio.map((para, i) => (
            <p key={i} className={i === 0 ? 'text-xl font-medium' : undefined}>
              {para}
            </p>
          ))}
          {p.cvPath && (
            <p className="mt-8">
              <LinkButton to={p.cvPath} download="" variant="primary">
                <Download size={17} aria-hidden="true" /> Download CV
              </LinkButton>
            </p>
          )}
        </div>
        <aside className="reveal lg:col-span-5 lg:col-start-8" aria-label="At a glance">
          {p.profileImageSquare && (
            <img src={publicUrl(p.profileImageSquare)} alt={`Portrait of ${p.fullName}`} width={480} height={480} className="aspect-square w-full max-w-[26rem] object-cover" />
          )}
          <dl className="mt-6 grid max-w-[26rem] grid-cols-2 gap-x-6 gap-y-5">
            <div className="col-span-2">
              <dt className="text-sm text-muted">Studying</dt>
              <dd className="text-base">
                {p.degree}, {p.university}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Year</dt>
              <dd className="text-base">{p.academicStatus}</dd>
            </div>
            {p.location && (
              <div>
                <dt className="text-sm text-muted">Based in</dt>
                <dd className="text-base">{p.location}</dd>
              </div>
            )}
          </dl>
        </aside>
      </div>

      <section className="mt-32 grid gap-12 lg:mt-44 lg:grid-cols-12 lg:gap-x-6" aria-labelledby="path-heading">
        {p.detailImages[0] && (
          <figure className="reveal lg:col-span-5">
            <img src={publicUrl(p.detailImages[0].src)} alt={p.detailImages[0].alt} width={1000} height={562} loading="lazy" className="aspect-[16/9] w-full object-cover" />
            <figcaption className="mt-3 text-sm text-muted">The embroidery on my massar.</figcaption>
          </figure>
        )}
        <div className="reveal lg:col-span-6 lg:col-start-7">
          <h2 id="path-heading" className="text-display-md">
            Where I’m heading
          </h2>
          <ol className="mt-8 grid gap-3">
            {site.path.map((step, i) => (
              <li key={step.title} className={cn('grid gap-1 p-6 sm:grid-cols-[7rem_1fr]', i === 0 ? 'bg-field text-field-ink' : 'bg-surface')}>
                <span className="text-base">{step.label}</span>
                <span>
                  <span className="block text-xl font-medium">{step.title}</span>
                  <span className="mt-1 block text-base">{step.detail}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className="mt-32 grid gap-16 md:grid-cols-2 lg:mt-44">
        <section aria-labelledby="interests-heading" className="reveal">
          <h2 id="interests-heading" className="text-display-md">
            Interests
          </h2>
          <ul className="mt-6 space-y-3 text-xl">
            {p.careerInterests.map((c) => (
              <li key={c} className="flex items-baseline gap-3">
                <span aria-hidden="true" className="h-2 w-2 shrink-0 translate-y-[-3px] rounded-full bg-field" />
                {c}
              </li>
            ))}
          </ul>
        </section>
        {platforms.size > 0 && (
          <section aria-labelledby="practice-heading" className="reveal">
            <h2 id="practice-heading" className="text-display-md">
              Where I practise
            </h2>
            <ul className="mt-6">
              {[...platforms.entries()]
                .sort((a, b) => b[1] - a[1])
                .map(([name, n]) => (
                  <li key={name}>
                    <Link to={`${categoryMeta.labs.path}?platform=${encodeURIComponent(name)}`} className="flex items-baseline justify-between gap-4 py-3 text-xl hover:text-accent">
                      <span>{name}</span>
                      <span className="text-base tabular-nums text-muted">{plural(n, 'lab')}</span>
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
