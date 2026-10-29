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
    <button type="button" onClick={share} className="inline-flex h-9 items-center gap-2 rounded-lg border border-line px-3 text-sm text-muted transition-colors hover:text-ink">
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
  const Icon = ui.icon;
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
    <article className="container-page pb-20 pt-10 sm:pt-14">
      <Breadcrumbs
        items={[
          ...(meta.path.startsWith('/achievements') ? [{ label: 'Achievements', to: '/achievements' }] : []),
          { label: meta.label, to: meta.path },
          { label: entry.title },
        ]}
      />
      <header className="border-b border-line pb-8">
        <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
          <span className={`inline-flex items-center gap-2 rounded-md bg-cat-${category}/10 px-2 py-1 font-medium text-cat-${category}`}>
            <Icon size={15} aria-hidden="true" />
            {meta.singular}
          </span>
          {status && <Badge tone={status.tone} dot>{status.label}</Badge>}
          {featured && (
            <Badge tone="accent">
              <Star size={12} aria-hidden="true" className="fill-current" /> Featured
            </Badge>
          )}
          {entry.sample && <SampleBadge />}
        </div>
        <h1 className="max-w-[24ch] font-display text-display-lg">{entry.title}</h1>
        <p className="mt-2 text-lg text-muted">
          {ui.byline(e)}
          {date && <span className="ml-3 whitespace-nowrap text-base">{date}</span>}
        </p>
        <p className="mt-5 max-w-[62ch] text-xl leading-relaxed text-ink/85">{entry.summary}</p>
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

      <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr),18rem]">
        <div className="min-w-0 space-y-8">
          <Suspense fallback={<div className="h-40 animate-pulse rounded-xl bg-sunken" />}>
            <Detail entry={entry} />
          </Suspense>
          {media.length > 0 && (
            <DetailSection title="Evidence">
              <MediaGallery items={media} />
            </DetailSection>
          )}
        </div>

        <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start" aria-label="Details">
          {facts.length > 0 && (
            <dl className="divide-y divide-line rounded-xl border border-line bg-surface">
              {facts.map((f) => (
                <div key={f.label} className="flex justify-between gap-4 px-4 py-3 text-sm">
                  <dt className="text-muted">{f.label}</dt>
                  <dd className="text-right">{f.value}</dd>
                </div>
              ))}
            </dl>
          )}
          {!!entry.skills?.length && (
            <div>
              <h2 className="mb-3 text-sm font-semibold text-muted">Skills</h2>
              <SkillLinks ids={entry.skills} />
            </div>
          )}
          {!!entry.tags?.length && (
            <div>
              <h2 className="mb-3 text-sm font-semibold text-muted">Tags</h2>
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
        <section className="mt-16 border-t border-line pt-10" aria-labelledby="related-heading">
          <h2 id="related-heading" className="mb-6 font-display text-display-md">
            Related
          </h2>
          <EntryGrid items={related} showCategory />
        </section>
      )}
    </article>
  );
}
