import { Check, ExternalLink, FileSearch, Link2, Share2, Star } from 'lucide-react';
import { Suspense, useState, type ComponentType } from 'react';
import { useParams } from 'react-router-dom';
import { Badge, SampleBadge, Tag } from '@/components/ui/Badge';
import { LinkButton } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { MediaGallery } from '@/components/ui/MediaGallery';
import { Breadcrumbs } from '@/components/ui/PageHeader';
import { categoryMeta } from '@/data/categories';
import { usePageMeta } from '@/hooks/usePageMeta';
import { entryDateLabel } from '@/lib/dates';
import { repository } from '@/lib/repository';
import type { AnyEntry, CategoryKey, LinkItem } from '@/types/content';
import { DetailSection, SkillLinks } from './details/primitives';
import { EntryGrid } from './EntryCard';
import { getUI, type Fact } from './registry';

const linkKindLabel: Record<NonNullable<LinkItem['kind']>, string> = {
  official: 'Official page',
  repository: 'Repository',
  demo: 'Live demo',
  verification: 'Verify credential',
  writeup: 'Write-up',
  documentation: 'Documentation',
  course: 'Course page',
  other: 'Link',
};

function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share && window.matchMedia('(pointer: coarse)').matches) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* user cancelled or clipboard blocked */
    }
  };
  return (
    <button type="button" onClick={share} className="inline-flex h-11 items-center gap-2 bg-surface px-5 text-base font-medium text-ink transition-colors hover:bg-sunken active:scale-[0.98]">
      {copied ? <Check size={15} aria-hidden="true" /> : <Share2 size={15} aria-hidden="true" />}
      <span aria-live="polite">{copied ? 'Link copied' : 'Share'}</span>
    </button>
  );
}

export default function EntryDetailPage({ category }: { category: CategoryKey }) {
  const { id = '' } = useParams();
  const meta = categoryMeta[category];
  const entry = repository.getEntry(category, id) as AnyEntry | undefined;
  usePageMeta(entry ? entry.title : 'Not found', entry?.summary);

  if (!entry) {
    return (
      <div className="container-page py-20">
        <EmptyState
          as="h1"
          icon={<FileSearch size={28} />}
          title={`That ${meta.singular.toLowerCase()} isn't here`}
          action={<LinkButton to={meta.path}>Browse {meta.label.toLowerCase()}</LinkButton>}
        >
          The link may be out of date, or the entry may have been removed.
        </EmptyState>
      </div>
    );
  }

  const ui = getUI(category);
  const e = entry as never;
  const status = ui.status(e);
  const facts = ui.facts(e).filter(Boolean) as Fact[];
  const Detail = ui.Detail as ComponentType<{ entry: AnyEntry }>;
  const related = repository.getRelated(category, entry);
  const featured = repository.isFeatured(category, entry.id);
  const media = ui.mediaInDetail ? [] : entry.media ?? [];
  const links = entry.links ?? [];
  const date = entryDateLabel(entry);

  return (
    <article className="container-page pb-10 pt-14 sm:pt-20">
      <Breadcrumbs
        items={[
          ...(meta.path.startsWith('/achievements') ? [{ label: 'Achievements', to: '/achievements' }] : []),
          { label: meta.label, to: meta.path },
          { label: entry.title },
        ]}
      />
      <header className="reveal pb-12">
        <h1 className="max-w-[22ch] text-display-lg">{entry.title}</h1>
        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-base">
          <span className="inline-flex items-center gap-2">
            <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full bg-cat-${category}`} />
            {meta.singular}
          </span>
          <span className="text-muted">{ui.byline(e)}</span>
          {date && <span className="whitespace-nowrap tabular-nums text-muted">{date}</span>}
          {status && <Badge tone={status.tone}>{status.label}</Badge>}
          {featured && (
            <span className="inline-flex items-center gap-1.5">
              <Star size={15} aria-hidden="true" className="fill-field text-field" /> Featured
            </span>
          )}
          {entry.sample && <SampleBadge />}
        </div>
        <p className="mt-8 max-w-[56ch] text-xl text-ink">{entry.summary}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {links.map((l) => (
            <LinkButton key={l.url} to={l.url} variant={l.kind === 'verification' || l.kind === 'demo' ? 'primary' : 'secondary'}>
              {l.kind === 'repository' ? <Link2 size={15} aria-hidden="true" /> : <ExternalLink size={15} aria-hidden="true" />}
              {l.label || linkKindLabel[l.kind ?? 'other']}
            </LinkButton>
          ))}
          <ShareButton title={entry.title} />
        </div>
      </header>

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr),20rem] lg:gap-20">
        <div className="min-w-0 space-y-8">
          <Suspense fallback={<div className="h-40 animate-pulse bg-surface" />}>
            <Detail entry={entry} />
          </Suspense>
          {media.length > 0 && (
            <DetailSection title="Evidence">
              <MediaGallery items={media} />
            </DetailSection>
          )}
        </div>

        <aside className="reveal space-y-10 lg:sticky lg:top-24 lg:self-start" aria-label="Details">
          {facts.length > 0 && (
            <dl className="grid gap-4 bg-surface p-6">
              {facts.map((f) => (
                <div key={f.label}>
                  <dt className="text-sm text-muted">{f.label}</dt>
                  <dd className="text-base">{f.value}</dd>
                </div>
              ))}
            </dl>
          )}
          {!!entry.skills?.length && (
            <div>
              <h2 className="mb-3 text-xl font-medium">Skills</h2>
              <SkillLinks ids={entry.skills} />
            </div>
          )}
          {!!entry.tags?.length && (
            <div>
              <h2 className="mb-3 text-xl font-medium">Tags</h2>
              <ul className="flex flex-wrap gap-2">
                {entry.tags.map((t) => (
                  <li key={t}>
                    <Tag>{t}</Tag>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-32" aria-labelledby="related-heading">
          <h2 id="related-heading" className="mb-8 text-display-md">
            Related
          </h2>
          <EntryGrid items={related} showCategory />
        </section>
      )}
    </article>
  );
}
